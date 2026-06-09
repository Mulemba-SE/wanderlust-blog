import nodemailer from "nodemailer";
import { getEmailFrom, getSmtpConfig } from "../config/env";

function createTransporter() {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.auth?.user || !smtpConfig.auth?.pass) {
    return null;
  }

  return nodemailer.createTransport(smtpConfig);
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const from = getEmailFrom();
  const message = {
    from,
    to: email,
    subject: "Wanderlust Blog Password Reset",
    text: `A password reset was requested for your Wanderlust Blog account. Use the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, ignore this email.`,
    html: `
      <p>A password reset was requested for your Wanderlust Blog account.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this change, you can safely ignore this email.</p>
    `,
  };

  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP is not configured. Password reset link:", resetLink);
    return;
  }

  await transporter.sendMail(message);
}
