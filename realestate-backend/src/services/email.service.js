import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

// ── Transporter — created once, reused for all sends ─────────────────────────
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// ── Base HTML wrapper ─────────────────────────────────────────────────────────
const htmlTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #1a1a2e; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .body { padding: 24px; background: #f9f9f9; }
    .footer { padding: 16px; text-align: center; font-size: 12px; color: #999; }
    .btn { display: inline-block; padding: 12px 24px; background: #e74c3c; color: white;
           text-decoration: none; border-radius: 6px; font-weight: bold; }
    .detail-row { display: flex; margin: 8px 0; }
    .detail-label { font-weight: bold; min-width: 130px; }
  </style>
</head>
<body>
  <div class="header"><h1>RealEstate Platform</h1></div>
  <div class="body">${body}</div>
  <div class="footer">© ${new Date().getFullYear()} RealEstate Platform. All rights reserved.</div>
</body>
</html>`;

// ── Send helper ───────────────────────────────────────────────────────────────
const send = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: config.email.from, to, subject, html });
};

// ── Welcome email ─────────────────────────────────────────────────────────────
export const sendWelcomeEmail = async (user) => {
  await send({
    to: user.email,
    subject: 'Welcome to RealEstate Platform!',
    html: htmlTemplate('Welcome', `
      <h2>Welcome, ${user.firstName}!</h2>
      <p>Thank you for joining RealEstate Platform. Your account has been created successfully.</p>
      <p>You can now browse properties, save favorites, and request viewings.</p>
    `),
  });
};

// ── Booking confirmation (sent to buyer + agent) ──────────────────────────────
export const sendBookingConfirmation = async (booking) => {
  const { property, buyer, agent, viewingDate, viewingTime } = booking;
  const formattedDate = new Date(viewingDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const body = `
    <h2>Viewing Request Confirmed</h2>
    <p>A viewing has been requested for the following property:</p>
    <div class="detail-row"><span class="detail-label">Property:</span> ${property.title}</div>
    <div class="detail-row"><span class="detail-label">Address:</span> ${property.address?.street}, ${property.address?.city}</div>
    <div class="detail-row"><span class="detail-label">Date:</span> ${formattedDate}</div>
    <div class="detail-row"><span class="detail-label">Time:</span> ${viewingTime}</div>
    <div class="detail-row"><span class="detail-label">Buyer:</span> ${buyer.firstName} ${buyer.lastName}</div>
    <div class="detail-row"><span class="detail-label">Buyer email:</span> ${buyer.email}</div>
    <p>The agent will confirm or reschedule within 24 hours.</p>
  `;

  await Promise.all([
    send({ to: buyer.email, subject: 'Viewing Request Submitted', html: htmlTemplate('Viewing Request', body) }),
    send({ to: agent.email, subject: 'New Viewing Request', html: htmlTemplate('New Viewing Request', body) }),
  ]);
};

// ── Booking status update (sent to buyer) ─────────────────────────────────────
export const sendBookingStatusUpdate = async (booking) => {
  const { property, buyer, status, viewingDate, viewingTime } = booking;
  const formattedDate = new Date(viewingDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const statusMessages = {
    confirmed: 'Your viewing has been confirmed! Please arrive on time.',
    cancelled: 'Unfortunately your viewing has been cancelled by the agent.',
    completed: 'Your viewing has been marked as completed.',
  };

  await send({
    to: buyer.email,
    subject: `Viewing ${status.charAt(0).toUpperCase() + status.slice(1)} — ${property.title}`,
    html: htmlTemplate('Booking Update', `
      <h2>Viewing ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
      <p>${statusMessages[status]}</p>
      <div class="detail-row"><span class="detail-label">Property:</span> ${property.title}</div>
      <div class="detail-row"><span class="detail-label">Date:</span> ${formattedDate}</div>
      <div class="detail-row"><span class="detail-label">Time:</span> ${viewingTime}</div>
    `),
  });
};

// ── Password reset email ──────────────────────────────────────────────────────
export const sendPasswordReset = async (user, token) => {
  const resetUrl = `${config.cors.frontendUrl}/reset-password/${token}`;

  await send({
    to: user.email,
    subject: 'Password Reset Request',
    html: htmlTemplate('Password Reset', `
      <h2>Reset Your Password</h2>
      <p>You requested a password reset. Click the button below to set a new password.</p>
      <p>This link expires in <strong>10 minutes</strong>.</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `),
  });
};
