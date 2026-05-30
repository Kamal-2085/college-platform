import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

const from =
  process.env.SMTP_FROM ||
  "College Compass <no-reply@collegecompass.com>";

export async function sendOTPEmail(email: string, otp: string) {
  return transporter.sendMail({
    to: email,
    from,
    subject: "Your verification code",
    text: `Your verification code is: ${otp}\n\nExpires in 10 minutes.`,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  return transporter.sendMail({
    to: email,
    from,
    subject: "Welcome to College Compass!",
    text: `Welcome to College Compass!\n\nYour account has been successfully created.`,
  });
}
