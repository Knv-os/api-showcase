import nodemailer from 'nodemailer';
import nodemailerHandlebars from 'nodemailer-express-handlebars';
import { SMTP_PASSWORD, SMTP_USERNAME } from '@config';
import { logger } from './logger';

export const sendMail = async (to: string, subject: string, template: string, context: any): Promise<string> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    const handlebarsOptions = {
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'src/email/',
        partialsDir: 'src/email/partials',
        defaultLayout: template,
      },
      viewPath: 'src/email',
      extName: '.hbs',
    };

    transporter.use('compile', nodemailerHandlebars(handlebarsOptions));

    const mailOptions = {
      from: SMTP_USERNAME,
      to: to,
      subject: `[CollarSystem] ${subject}`,
      template: template,
      context: context,
    };
    const { response } = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    logger.error(error);
  }
};
