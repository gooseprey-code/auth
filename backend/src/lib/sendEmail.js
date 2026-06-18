import { createResetPasswordTemplate, createVerifyEmailTemplate, createWelcomeEmailTemplate } from "./email.template.js";
import ENV from "./env.js";
import transporter from "./nodemailer.config.js";

const sendVerificationEmail = async (reciepient, userName, code) => {
  try {
    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: `${reciepient}`,
      subject: `Email Verification`,
      html: createVerifyEmailTemplate(userName, code),
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error(error);
  }
};

const sendResetPasswordEmail = async (reciepient, userName, clientURL) => {
  try {
    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: `${reciepient}`,
      subject: `Email Verification`,
      html: createResetPasswordTemplate(userName, clientURL),
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error(error);
  }
};

const sendWelcomeEmail = async (reciepient, userName, clientURL) => {
  try {
    const info = await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to: `${reciepient}`,
      subject: `Welcome`,
      html: createWelcomeEmailTemplate(userName, clientURL),
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error(error);
  }
};
export {sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail};