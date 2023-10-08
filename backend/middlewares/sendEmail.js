const nodemailer = require("nodemailer");


exports.sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_MAIL, // generated ethereal user
            pass: process.env.SMPT_PASSWORD,  // generated ethereal password
        },
        service:process.env.SMPT_SERVICE,
});

    const mailOptions = {
        from: "Nodemailer Contact", // sender address
        to: options?.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
}