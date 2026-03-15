const nodemailer = require("nodemailer");
const config = require("../../../config/environment");
const logger = require("../../../utils/logger");

/**
 * Email Service using Nodemailer
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
  }

  /**
   * Initialize email transporter
   */
  async initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_PORT === 465, // TLS for port 587, SSL for 465
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
        },
      });

      // Verify connection
      await this.transporter.verify();
      this.isInitialized = true;
      logger.info("Email service initialized successfully");
    } catch (error) {
      logger.error(`Email service initialization failed: ${error.message}`);
      logger.warn("Email notifications will be disabled");
    }
  }

  /**
   * Send email
   */
  async send(to, subject, htmlContent, replyTo = null) {
    try {
      if (!this.isInitialized) {
        logger.warn(
          `Email not sent (service not initialized): ${to} - ${subject}`,
        );
        return null;
      }

      const mailOptions = {
        from: config.SMTP_FROM,
        to,
        subject,
        html: htmlContent,
      };

      if (replyTo) {
        mailOptions.replyTo = replyTo;
      }

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId} to ${to}`);

      return info;
    } catch (error) {
      logger.error(`Error sending email to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send account verification email
   */
  async sendVerificationEmail(email, fullName, verificationLink) {
    const htmlContent = `
      <h2>Welcome to Bookstore, ${fullName}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link expires in 24 hours.</p>
    `;

    return this.send(email, "Verify Your Email Address", htmlContent);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, resetLink) {
    const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>Or copy this link: ${resetLink}</p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    return this.send(email, "Reset Your Password", htmlContent);
  }

  /**
   * Send purchase confirmation email
   */
  async sendPurchaseConfirmation(email, fullName, order, books) {
    const booksList = books
      .map((b) => `<li>${b.title} by ${b.author}</li>`)
      .join("");

    const htmlContent = `
      <h2>Purchase Confirmation</h2>
      <p>Hello ${fullName},</p>
      <p>Thank you for your purchase! Here are your books:</p>
      <ul>${booksList}</ul>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
      <p><strong>Purchased At:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p>You can now access your books in your dashboard.</p>
      <a href="${config.FRONTEND_URL}/dashboard/purchases" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View Your Books
      </a>
    `;

    return this.send(email, "Purchase Confirmation", htmlContent);
  }

  /**
   * Send order approval notification
   */
  async sendOrderApprovalNotification(email, fullName, orderID) {
    const htmlContent = `
      <h2>Order Approved</h2>
      <p>Hello ${fullName},</p>
      <p>Your order #${orderID} has been approved!</p>
      <p>You can now access your purchased books in your dashboard.</p>
      <a href="${config.FRONTEND_URL}/dashboard/purchases" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Access Your Books
      </a>
    `;

    return this.send(email, "Order Approved", htmlContent);
  }

  /**
   * Send refund notification
   */
  async sendRefundNotification(email, fullName, orderID, refundAmount) {
    const htmlContent = `
      <h2>Refund Processed</h2>
      <p>Hello ${fullName},</p>
      <p>Your refund has been processed.</p>
      <p><strong>Order ID:</strong> ${orderID}</p>
      <p><strong>Refund Amount:</strong> $${refundAmount}</p>
      <p>The refund may take 3-5 business days to appear in your account.</p>
    `;

    return this.send(email, "Refund Processed", htmlContent);
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email, fullName) {
    const htmlContent = `
      <h2>Welcome to Bookstore, ${fullName}!</h2>
      <p>We're excited to have you join our community of readers.</p>
      <p>Explore our vast collection of books and start reading today!</p>
      <a href="${config.FRONTEND_URL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Explore Books
      </a>
    `;

    return this.send(email, "Welcome to Bookstore!", htmlContent);
  }
}

// Initialize and export singleton
const emailService = new EmailService();
if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
  emailService.initialize();
}

module.exports = emailService;
