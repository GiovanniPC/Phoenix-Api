require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.sparkpostmail.com",
  port: 587,
  secure: false,
  authMethod: "LOGIN",
  auth: {
    user: process.env.SPARKPOST_USER,
    pass: process.env.SPARKPOST_PASSWORD ,
    },
});

module.exports = transporter;