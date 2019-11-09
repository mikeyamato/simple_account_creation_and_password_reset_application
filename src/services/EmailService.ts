import sgMail from '@sendgrid/mail';
import logger from '../logger';
​
export function initTransportEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  sgMail.setSubstitutionWrappers('{{', '}}');
  logger.info('Connection to SendGrid established.')
}
​
export async function sendResetPasswordEmail(email: string, token: string) {
  const msg: any = {
    to: email,
    from: process.env.EMAIL_SENDER_NO_REPLY,
    dynamic_template_data: {
      reset_link: `${process.env.FRONT_END_SITE_URL}/resetpassword/${token}`,
      site_url: process.env.SITE_URL
    },
    template_id: `${process.env.RESET_PASSWORD_EMAIL_SENDGRID_TEMPLATE_ID}`
  };
  return await sgMail.send(msg);
}