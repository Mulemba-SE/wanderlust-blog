import nodemailer from "nodemailer";
import { getEmailFrom, getSmtpConfig } from "../config/env";
const smtpConfig = getSmtpConfig();
if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.auth?.user || !smtpConfig.auth?.pass) {
    throw new Error("SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
}
const transporter = nodemailer.createTransport(smtpConfig);
export async function sendPasswordResetEmail(email, resetLink) {
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
    await transporter.sendMail(message);
}
