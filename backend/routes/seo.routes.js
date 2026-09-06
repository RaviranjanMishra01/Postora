const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Category = require("../models/Category");

router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${req.protocol}://${req.get("host")}/sitemap.xml`);
});

router.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" }).select("slug updatedAt");
    const categories = await Category.find().select("slug updatedAt");

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;

    posts.forEach((p) => {
      xml += `  <url><loc>${baseUrl}/post/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });

    categories.forEach((c) => {
      xml += `  <url><loc>${baseUrl}/category/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
    });

    xml += `</urlset>`;

    res.type("application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
