const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const path = require("path");

// Configure Cloudinary explicitly parsing CLOUDINARY_URL or individual credentials
if (process.env.CLOUDINARY_URL) {
  try {
    const rawUrl = process.env.CLOUDINARY_URL.trim();
    const match = rawUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      cloudinary.config({
        api_key: match[1],
        api_secret: match[2],
        cloud_name: match[3],
        secure: true,
      });
    } else {
      cloudinary.config();
    }
  } catch (e) {
    cloudinary.config();
  }
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload local file to Cloudinary in a structured folder (e.g., postora/avatars, postora/posts)
 * Fallback to local storage if Cloudinary fails (e.g. 403 Forbidden).
 * @param {string} localFilePath - Temporary local file path
 * @param {string} folderName - Subfolder ("avatars", "posts", "categories", "media")
 * @param {object} reqHostInfo - Optional { protocol, host } for local fallback URL
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = async (localFilePath, folderName = "media", reqHostInfo = null) => {
  if (!localFilePath) return null;

  try {
    const targetFolder = `postora/${folderName}`;
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: targetFolder,
      resource_type: "image",
    });

    // Clean up temporary local file after successful Cloudinary upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("⚠️ Cloudinary Upload Warning:", error.message || error);
    if (error.http_code === 403 || error.message?.includes("403")) {
      console.warn("⚠️ TIP: Cloudinary 403 occurs if your Cloudinary account email is unverified or API Key/Secret is invalid.");
      console.warn("⚠️ Using local storage fallback so image upload completes successfully!");
    }

    // Local Fallback: Keep file in /uploads/ and return accessible URL
    const filename = path.basename(localFilePath);
    const host = reqHostInfo?.host || process.env.SERVER_HOST || "postora-vo54.onrender.com";
    const protocol = reqHostInfo?.protocol || (process.env.NODE_ENV === "production" ? "https" : "http");
    const localUrl = `${protocol}://${host}/uploads/${filename}`;

    return {
      secure_url: localUrl,
      public_id: "",
    };
  }
};

/**
 * Extract public_id from Cloudinary URL or return raw public_id
 * Example: https://res.cloudinary.com/xtac33gl/image/upload/v1741541234/postora/avatars/abc.jpg -> postora/avatars/abc
 * @param {string} urlOrPublicId
 * @returns {string|null}
 */
const extractPublicId = (urlOrPublicId) => {
  if (!urlOrPublicId || typeof urlOrPublicId !== "string") return null;
  if (!urlOrPublicId.includes("cloudinary.com")) {
    if (urlOrPublicId.includes("postora/")) return urlOrPublicId;
    return null;
  }
  try {
    const parts = urlOrPublicId.split("/upload/");
    if (parts.length < 2) return null;
    let publicIdWithExt = parts[1];
    // Strip version string (e.g. v1573726723/)
    publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, "");
    // Strip query parameters
    publicIdWithExt = publicIdWithExt.split("?")[0];
    // Strip file extension
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return publicIdWithExt.substring(0, lastDotIndex);
    }
    return publicIdWithExt;
  } catch (err) {
    return null;
  }
};

/**
 * Real-time deletion of an asset from Cloudinary by URL or public_id
 * @param {string} urlOrPublicId
 * @returns {Promise<boolean>}
 */
const deleteFromCloudinary = async (urlOrPublicId) => {
  const publicId = extractPublicId(urlOrPublicId);
  if (!publicId) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion failed for public_id:", publicId, error);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  extractPublicId,
  deleteFromCloudinary,
};
