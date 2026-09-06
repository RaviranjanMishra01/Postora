const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log(`[EMAIL DEV MOCK] To: ${to} | Subject: ${subject}`);
      console.log(`[EMAIL CONTENT]`, text || html);
      return { messageId: "dev-mock-id" };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'MERN Blog'}" <${process.env.EMAIL_FROM || 'noreply@blog.com'}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // In dev mode, don't throw to break registration flow if SMTP fails
    if (process.env.NODE_ENV === "development") {
      return { messageId: "dev-fallback-id" };
    }
    throw error;
  }
};

module.exports = sendEmail;
