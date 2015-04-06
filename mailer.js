var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'give.me.newsfeed@gmail.com',
        pass: process.env.mailPassword
    }
});

module.exports = transporter;