import { useEffect } from "react";

const SITE_URL = "https://postora-seven.vercel.app";
const DEFAULT_TITLE = "Postora — Modern Tech, AI & Lifestyle Publication";
const DEFAULT_DESCRIPTION = "Discover in-depth publications, engineering insights, artificial intelligence breakthroughs, and design trends on Postora.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

const SEO = ({
  title,
  description,
  image,
  url = "",
  type = "website",
  articleData = null,
  schema = null,
  noindex = false,
  breadcrumbs = null,
}) => {
  useEffect(() => {
    const fullTitle = title ? (title.includes("Postora") ? title : `${title} | Postora`) : DEFAULT_TITLE;
    const metaDescription = description || DEFAULT_DESCRIPTION;
    const metaImage = image || DEFAULT_IMAGE;
    const cleanPath = url ? (url.startsWith("/") ? url : `/${url}`) : "";
    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    // Document Title
    document.title = fullTitle;

    // Helper to update meta tag by name or property
    const setMetaTag = (attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper for link canonical tag
    const setCanonical = (href) => {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    // Update standard meta tags
    setMetaTag("name", "description", metaDescription);
    setMetaTag("name", "title", fullTitle);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setCanonical(canonicalUrl);

    // Update Open Graph tags
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", metaDescription);
    setMetaTag("property", "og:image", metaImage);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", "Postora");

    // Update Twitter card tags
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", metaDescription);
    setMetaTag("name", "twitter:image", metaImage);
    setMetaTag("name", "twitter:card", "summary_large_image");

    // Inject JSON-LD Schema
    let scriptTag = document.querySelector("#seo-jsonld");
    if (!noindex) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "application/ld+json");
        scriptTag.setAttribute("id", "seo-jsonld");
        document.head.appendChild(scriptTag);
      }

      const mainSchema = schema || {
        "@context": "https://schema.org",
        "@type": type === "article" ? "BlogPosting" : "WebPage",
        "headline": title || DEFAULT_TITLE,
        "description": metaDescription,
        "image": metaImage,
        "url": canonicalUrl,
        "publisher": {
          "@type": "Organization",
          "name": "Postora",
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/favicon.svg`
          }
        },
        ...(articleData?.author && {
          "author": {
            "@type": "Person",
            "name": articleData.author.name || articleData.author.username,
            "url": `${SITE_URL}/author/${articleData.author.username}`
          }
        }),
        ...(articleData?.publishedAt && {
          "datePublished": articleData.publishedAt,
          "dateModified": articleData.updatedAt || articleData.publishedAt
        }),
        ...(articleData?.category && {
          "articleSection": articleData.category.name
        })
      };

      // Breadcrumb Schema construction if breadcrumbs provided
      let breadcrumbSchema = null;
      if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
        breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": crumb.name,
            "item": crumb.item ? (crumb.item.startsWith("http") ? crumb.item : `${SITE_URL}${crumb.item.startsWith("/") ? crumb.item : `/${crumb.item}`}`) : SITE_URL
          }))
        };
      }

      const finalJsonLd = breadcrumbSchema
        ? { "@context": "https://schema.org", "@graph": [mainSchema, breadcrumbSchema] }
        : mainSchema;

      scriptTag.textContent = JSON.stringify(finalJsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, image, url, type, articleData, schema, noindex, breadcrumbs]);

  return null;
};

export default SEO;
