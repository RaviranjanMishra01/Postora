const User = require("../models/User");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Database already seeded.");
      return;
    }

    console.log("Seeding initial demo data into database...");

    // Create Demo Users
    const superAdmin = await User.create({
      name: "Alex Vance (SuperAdmin)",
      username: "superadmin",
      email: "superadmin@blog.com",
      password: "Password123!",
      role: "superadmin",
      status: "active",
      bio: "Platform Architect & Chief Editor.",
      isEmailVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    });

    const admin = await User.create({
      name: "Sarah Jenkins",
      username: "sarahadmin",
      email: "admin@blog.com",
      password: "Password123!",
      role: "admin",
      status: "active",
      bio: "Managing Editor and Content Strategist.",
      isEmailVerified: true,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    });

    const author = await User.create({
      name: "Ravi Mishra",
      username: "ravimishra",
      email: "author@blog.com",
      password: "Password123!",
      role: "author",
      status: "active",
      bio: "Full-Stack Developer writing about modern web tech, AI, and MERN architecture.",
      isEmailVerified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      socialLinks: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    });

    const user = await User.create({
      name: "Jane Doe",
      username: "janedoe",
      email: "user@blog.com",
      password: "Password123!",
      role: "user",
      status: "active",
      bio: "Passionate reader & tech enthusiast.",
      isEmailVerified: true,
    });

    // Create Categories
    const techCat = await Category.create({
      name: "Technology",
      slug: "technology",
      description: "Cutting edge insights on software engineering, web frameworks, and cloud.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      postCount: 2,
    });

    const aiCat = await Category.create({
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "Exploring machine learning, LLMs, neural networks, and agentic AI.",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
      postCount: 1,
    });

    const designCat = await Category.create({
      name: "Design & UX",
      slug: "design-ux",
      description: "Crafting beautiful interfaces, user experience, and CSS art.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      postCount: 1,
    });

    // Create Tags
    const reactTag = await Tag.create({ name: "React", slug: "react", postCount: 2 });
    const mernTag = await Tag.create({ name: "MERN Stack", slug: "mern-stack", postCount: 2 });
    const nodeTag = await Tag.create({ name: "Node.js", slug: "nodejs", postCount: 1 });
    const aiTag = await Tag.create({ name: "AI & Agents", slug: "ai-agents", postCount: 1 });

    // Create Sample Posts
    await Post.create({
      title: "Building Production-Ready Full-Stack MERN Applications in 2026",
      slug: "building-production-ready-full-stack-mern-applications-2026",
      excerpt: "A comprehensive deep dive into scalable backend architectures, JWT cookie authentication, Mongoose optimizations, and React 19 visual excellence.",
      content: `<h2>Introduction</h2><p>Building high-performance full-stack web applications requires careful planning, clean component separation, and robust security. In this guide, we examine the MERN stack with modern best practices.</p><h2>Backend Architecture</h2><p>Using a decoupled structure with Controllers, Services, Routes, and Middleware ensures maintainability as your codebase grows.</p><blockquote>"Clean architecture is not an option; it's a foundation for survival in fast-moving engineering environments."</blockquote><pre><code>const express = require('express');\nconst app = express();\n\napp.listen(3000, () => console.log('Server running!'));</code></pre><p>Key security layers include HTTP-only JWT cookies, Helmet headers, express-rate-limit, and NoSQL query sanitization.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      readingTime: 4,
      author: author._id,
      category: techCat._id,
      tags: [reactTag._id, mernTag._id, nodeTag._id],
      status: "published",
      isFeatured: true,
      seoTitle: "Building Production-Ready MERN Apps (2026)",
      seoDescription: "Learn how to architect, build, and deploy production-ready full stack MERN blog platforms.",
      views: 1240,
      likesCount: 89,
      commentsCount: 12,
      publishedAt: new Date(),
    });

    await Post.create({
      title: "The Era of Agentic AI: Transforming Software Development",
      slug: "era-of-agentic-ai-transforming-software-development",
      excerpt: "Discover how multi-agent orchestrators and autonomous AI tools are reshaping modern coding workflows.",
      content: `<h2>The Shift to Agentic Workflows</h2><p>Artificial intelligence is moving beyond basic code autocomplete to full agentic collaboration. Autonomous subagents now handle code analysis, multi-file edits, and automated verification.</p><h3>Key Advantages</h3><ul><li>Context-aware code refactoring</li><li>Parallel execution of research tasks</li><li>Automated error log diagnosis</li></ul>`,
      featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      readingTime: 3,
      author: author._id,
      category: aiCat._id,
      tags: [aiTag._id],
      status: "published",
      isFeatured: true,
      seoTitle: "The Era of Agentic AI in Software Engineering",
      seoDescription: "Explore agentic AI assistants and their impact on developer productivity.",
      views: 950,
      likesCount: 64,
      commentsCount: 5,
      publishedAt: new Date(Date.now() - 86400000),
    });

    console.log("Successfully seeded demo data! Credentials:");
    console.log("SuperAdmin: superadmin@blog.com / Password123!");
    console.log("Admin: admin@blog.com / Password123!");
    console.log("Author: author@blog.com / Password123!");
    console.log("User: user@blog.com / Password123!");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
};

module.exports = seedInitialData;
