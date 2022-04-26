const nodemailer = require("nodemailer");
const {GMAIL_EMAIL, GMAIL_PASSWORD} = require("../config/env.config")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: GMAIL_EMAIL, 
        pass: GMAIL_PASSWORD, 
    },
})

module.exports = transporter