const nodemailer = require('nodemailer');

export default () => {
     /*nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });*/
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'delaney33@ethereal.email',
            pass: 'xRUwSzzzDnCyuUQMpr'
        }
    });
};
