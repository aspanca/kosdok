import nodemailer from "nodemailer";
import { env } from "../config";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth:
    env.smtp.user && env.smtp.pass
      ? { user: env.smtp.user, pass: env.smtp.pass }
      : undefined,
});

function canSendEmail(): boolean {
  return !!(env.smtp.user && env.smtp.pass);
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  verifyUrl: string
): Promise<void> {
  if (!canSendEmail()) {
    console.log("[DEV] Verification email (SMTP not configured):");
    console.log(`  To: ${to}`);
    console.log(`  Link: ${verifyUrl}`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: "Verifiko email-in tënd - Kosdok",
    html: `
      <h2>Përshëndetje ${name},</h2>
      <p>Faleminderit që u regjistruat në Kosdok. Klikoni linkun më poshtë për të verifikuar email-in tuaj:</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">Verifiko email-in</a></p>
      <p>Ky link skadon pas 24 orësh.</p>
      <p>Nëse nuk keni kërkuar këtë, mund të injoroni këtë email.</p>
      <p>— Ekipi Kosdok</p>
    `,
    text: `Përshëndetje ${name},\n\nFaleminderit që u regjistruat në Kosdok. Klikoni linkun më poshtë për të verifikuar email-in tuaj:\n\n${verifyUrl}\n\nKy link skadon pas 24 orësh.\n\n— Ekipi Kosdok`,
  });
}
