// email configurations
const sgMail = require('@sendgrid/mail');
const { SG_API_KEY } = require("../../env");
sgMail.setApiKey(SG_API_KEY);
// var transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "c67216c64964ab",
//     pass: "602d03a24fd8ac"
//   }
// });
module.exports = {
    sgMail
}