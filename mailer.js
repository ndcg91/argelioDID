var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
module.exports = {};
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ndcg9105@gmail.com",
        pass: "Melany90"
    }
});

// setup email data with unicode symbols
module.exports.sendRegisterMail = function (token,email){
    let mailOptions = {
        from: '"Callcaribe 👻" <admin@callcaribe.com>', // sender address
        to: email, // list of receivers
        subject: 'Confirm your email address ✔', // Subject line
        html: '<a href="http://localhost:3000/register/' + token + '">Click here to confirm your email</a>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}


