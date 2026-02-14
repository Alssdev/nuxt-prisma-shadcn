import { Resend } from 'resend';

interface SendEmailParams {
  emailTo: string;
  subject: string;
  bodyHTML: string;
}

export default async function sendEmail({
  emailTo,
  subject,
  bodyHTML,
}: SendEmailParams): Promise<void> {
  const { resendApiKey } = useRuntimeConfig();

  if (!resendApiKey) {
    console.warn('[sendEmail] Missing resendApiKey in runtimeConfig. Skipping email.');
    return;
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: 'Vendoo Sistema <onboarding@resend.dev>',
    to: emailTo,
    subject,
    html: bodyHTML,
  });

  console.info(`[sendEmail] Email sent to ${emailTo}: ${subject}`);
}
