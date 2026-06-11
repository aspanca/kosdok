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

export async function sendBookingRequestEmail(
  to: string,
  providerName: string,
  patientName: string,
  date: string,
  time: string
): Promise<void> {
  if (!canSendEmail()) {
    console.log("[DEV] Booking request email (SMTP not configured):");
    console.log(`  To: ${to} | ${patientName} kërkoi takim më ${date} në ${time}`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: "Kërkesë e re për takim - Kosdok",
    html: `
      <h2>Përshëndetje ${providerName},</h2>
      <p>Keni një kërkesë të re për takim nga <strong>${patientName}</strong>.</p>
      <p>Data: <strong>${date}</strong> në orën <strong>${time}</strong>.</p>
      <p>Kyçuni në Kosdok për ta konfirmuar ose anuluar.</p>
      <p>— Ekipi Kosdok</p>
    `,
    text: `Përshëndetje ${providerName},\n\nKeni një kërkesë të re për takim nga ${patientName} më ${date} në orën ${time}.\n\nKyçuni në Kosdok për ta konfirmuar ose anuluar.\n\n— Ekipi Kosdok`,
  });
}

export async function sendBookingConfirmedEmail(
  to: string,
  patientName: string,
  providerName: string,
  date: string,
  time: string
): Promise<void> {
  if (!canSendEmail()) {
    console.log("[DEV] Booking confirmed email (SMTP not configured):");
    console.log(`  To: ${to} | Takimi me ${providerName} më ${date} në ${time} u konfirmua`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: "Takimi juaj u konfirmua - Kosdok",
    html: `
      <h2>Përshëndetje ${patientName},</h2>
      <p>Takimi juaj me <strong>${providerName}</strong> u konfirmua.</p>
      <p>Data: <strong>${date}</strong> në orën <strong>${time}</strong>.</p>
      <p>Ju lutemi paraqituni me kohë. Nëse nuk mund të vini, anuloni takimin në Kosdok.</p>
      <p>— Ekipi Kosdok</p>
    `,
    text: `Përshëndetje ${patientName},\n\nTakimi juaj me ${providerName} u konfirmua për më ${date} në orën ${time}.\n\nJu lutemi paraqituni me kohë. Nëse nuk mund të vini, anuloni takimin në Kosdok.\n\n— Ekipi Kosdok`,
  });
}

export async function sendBookingCancelledEmail(
  to: string,
  patientName: string,
  providerName: string,
  date: string,
  time: string
): Promise<void> {
  if (!canSendEmail()) {
    console.log("[DEV] Booking cancelled email (SMTP not configured):");
    console.log(`  To: ${to} | Takimi me ${providerName} më ${date} në ${time} u anulua`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: "Takimi juaj u anulua - Kosdok",
    html: `
      <h2>Përshëndetje ${patientName},</h2>
      <p>Na vjen keq, takimi juaj me <strong>${providerName}</strong> më <strong>${date}</strong> në orën <strong>${time}</strong> u anulua.</p>
      <p>Mund të rezervoni një termin tjetër në Kosdok.</p>
      <p>— Ekipi Kosdok</p>
    `,
    text: `Përshëndetje ${patientName},\n\nNa vjen keq, takimi juaj me ${providerName} më ${date} në orën ${time} u anulua.\n\nMund të rezervoni një termin tjetër në Kosdok.\n\n— Ekipi Kosdok`,
  });
}
