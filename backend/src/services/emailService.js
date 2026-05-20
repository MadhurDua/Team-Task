import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendInviteEmail({ to, projectName, inviter }) {
  if (!env.smtp.host || !env.smtp.user) {
    console.log(`Invite email skipped for ${to}: SMTP is not configured.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass }
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: `You're invited to ${projectName}`,
    text: `${inviter} invited you to collaborate on ${projectName}.`
  });
}
