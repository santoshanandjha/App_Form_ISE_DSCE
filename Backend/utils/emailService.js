import nodemailer from 'nodemailer';
import { logger, maskEmail } from './securityLogger.js';

/* =========================
   Generate 6-digit OTP
========================= */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =========================
   Send Email via Gmail SMTP or Resend
========================= */
const sendEmail = async (to, subject, html, text) => {
  const SMTP_EMAIL = process.env.SMTP_EMAIL;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_EMAIL || 'AMS DSCE <no-reply@amsdsce.com>';

  // Option 1: Send via Gmail SMTP if configured
  if (SMTP_EMAIL && SMTP_PASSWORD && SMTP_EMAIL !== 'your-email@gmail.com') {
    console.log(`📧 Sending email via Gmail SMTP to: ${to}`);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: `AMS DSCE <${SMTP_EMAIL}>`,
      to,
      subject,
      text,
      html
    });
    return { id: info.messageId, status: 'sent' };
  }

  // Option 2: Send via Resend if API key present
  if (RESEND_API_KEY) {
    console.log(`📧 Sending email via Resend to: ${to}`);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    return await response.json();
  }

  // Option 3: Fallback Dev Console Log
  console.log(`\n==================================================`);
  console.log(`📧 [DEV MOCK EMAIL SERVICE]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  console.log(`==================================================\n`);
  return { id: 'mock-dev-email-id', status: 'mocked' };
};

/* =========================
   Send OTP Email
========================= */
export const sendOTPEmail = async (email, otp) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px; border: 1px solid #ddd;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Your OTP for the Appraisal Management System is:</p>
            <div style="font-size:32px; font-weight:bold; letter-spacing:5px; color:#4F46E5; padding: 10px 0;">
              ${otp}
            </div>
            <p><strong>Valid for 10 minutes.</strong></p>
            <p style="color:red;">Do not share this OTP with anyone.</p>
          </div>
        </body>
      </html>
    `;

    const text = `Your OTP for account verification is: ${otp}. Valid for 10 minutes.`;

    const result = await sendEmail(
      email,
      'Your Account Verification OTP',
      html,
      text
    );

    logger.success('OTP email sent', maskEmail(email));

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ OTP email error (full):', error.message);
    logger.error('Email sending error', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

/* =========================
   Send Welcome Email
========================= */
export const sendWelcomeEmail = async (email, role) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px; border: 1px solid #ddd;">
            <h2>Welcome 🎉</h2>
            <p>Your account has been created successfully in the AMS DSCE system.</p>
            <p><strong>Role:</strong> ${role}</p>
          </div>
        </body>
      </html>
    `;

    const text = `Welcome! Your account has been created with the role: ${role}.`;

    await sendEmail(
      email,
      'Welcome to Appraisal Management System',
      html,
      text
    );

    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Welcome email error:', error);
    // Not critical, so not throwing
  }
};

/* =========================
   Send Password Reset OTP
========================= */
export const sendPasswordResetOTP = async (email, otp, role) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px; border: 1px solid #ddd;">
            <h2>Password Reset Request 🔐</h2>
            <p>Account Role: <strong>${role}</strong></p>
            <p>Your OTP:</p>
            <div style="font-size:32px; font-weight:bold; letter-spacing:5px; color:#DC2626; padding: 10px 0;">
              ${otp}
            </div>
            <p><strong>Valid for 10 minutes.</strong></p>
            <p style="color:red;">
              Do not share this code with anyone. If you didn’t request this, ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `Your Password Reset OTP: ${otp}. Valid for 10 minutes.`;

    const result = await sendEmail(
      email,
      'Password Reset OTP',
      html,
      text
    );

    logger.success('Password reset OTP sent', maskEmail(email));

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Password reset email error (full):', error.message);
    logger.error('Password reset email error', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};
