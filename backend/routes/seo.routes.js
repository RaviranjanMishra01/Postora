const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const User = require("../models/User");

const getCleanBaseUrl = () => {
  const rawUrl = process.env.SITE_URL || process.env.CLIENT_URL || "https://postora-seven.vercel.app";
  const urls = rawUrl.split(",").map((u) => u.trim());
  const vercelOrProdUrl = urls.find(
    (u) => u.includes("vercel.app") || (!u.includes("localhost") && !u.includes("127.0.0.1") && !u.includes("onrender.com"))
  );

  let targetUrl = vercelOrProdUrl || urls[0] || "https://postora-seven.vercel.app";
  if (targetUrl.includes("localhost") || targetUrl.includes("127.0.0.1") || targetUrl.includes("onrender.com")) {
    targetUrl = "https://postora-seven.vercel.app";
  }

  return targetUrl.replace(/\/$/, "");
};

// @route GET /robots.txt
router.get("/robots.txt", (req, res) => {
  const baseUrl = getCleanBaseUrl();
  res.type("text/plain");
  res.send(
`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /super-admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`
  );
});

// @route GET /sitemap.xml
router.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" }).select("slug updatedAt").sort({ updatedAt: -1 });
    const categories = await Category.find().select("slug updatedAt").sort({ name: 1 });
    const tags = await Tag.find().select("slug updatedAt").sort({ name: 1 });
    const authors = await User.find({ status: "active", role: { $in: ["author", "admin", "superadmin"] } }).select("username updatedAt");

    const baseUrl = getCleanBaseUrl();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;

    // Static pages
    const staticPages = ["about", "contact", "privacy", "terms", "cookie-policy", "disclaimer", "categories", "search"];
    staticPages.forEach((page) => {
      xml += `  <url><loc>${baseUrl}/${page}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
    });

    // Posts
    posts.forEach((p) => {
      const lastMod = p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString();
      xml += `  <url><loc>${baseUrl}/post/${p.slug}</loc><lastmod>${lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
    });

    // Categories
    categories.forEach((c) => {
      xml += `  <url><loc>${baseUrl}/category/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
    });

    // Tags
    tags.forEach((t) => {
      xml += `  <url><loc>${baseUrl}/tag/${t.slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
    });

    // Authors
    authors.forEach((a) => {
      if (a.username) {
        xml += `  <url><loc>${baseUrl}/author/${a.username}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
      }
    });

    xml += `</urlset>`;

    res.type("application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=14400");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap generation error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

// @route GET /rss.xml or /feed.xml
const generateRssFeed = async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "name username")
      .populate("category", "name")
      .sort({ publishedAt: -1 })
      .limit(30);

    const baseUrl = getCleanBaseUrl();

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
    rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2000/xmlns/atom">\n`;
    rss += `  <channel>\n`;
    rss += `    <title>Postora — Modern Tech &amp; Lifestyle Publication</title>\n`;
    rss += `    <link>${baseUrl}</link>\n`;
    rss += `    <description>Latest insights on software engineering, AI, design, and web architecture.</description>\n`;
    rss += `    <language>en-us</language>\n`;
    rss += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;

    posts.forEach((p) => {
      const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString();
      const authorName = p.author?.name || "Postora Editorial";
      const catName = p.category?.name || "General";
      const excerpt = (p.excerpt || p.title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      rss += `    <item>\n`;
      rss += `      <title>${p.title.replace(/&/g, "&amp;")}</title>\n`;
      rss += `      <link>${baseUrl}/post/${p.slug}</link>\n`;
      rss += `      <guid isPermaLink="true">${baseUrl}/post/${p.slug}</guid>\n`;
      rss += `      <pubDate>${pubDate}</pubDate>\n`;
      rss += `      <author>${authorName}</author>\n`;
      rss += `      <category>${catName.replace(/&/g, "&amp;")}</category>\n`;
      rss += `      <description>${excerpt}</description>\n`;
      rss += `    </item>\n`;
    });

    rss += `  </channel>\n`;
    rss += `</rss>`;

    res.type("application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(rss);
  } catch (err) {
    console.error("RSS generation error:", err);
    res.status(500).send("Error generating RSS feed");
  }
};

router.get("/rss.xml", generateRssFeed);
router.get("/feed.xml", generateRssFeed);

module.exports = router;
