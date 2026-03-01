const nodemailer = require('nodemailer');


const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
             port: 2525,
             auth: {
                user: "429e25a3d8caba",
                pass: "953c843770d091"
             }
        })

      const mailOptions = {
        from: 'Sujay sen <hello@gmail.io>',
        to: options.email,
        subject: options.subject,
        text: options.text
    };

    await transporter.sendMail(mailOptions);

}

module.exports = sendMail;