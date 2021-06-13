'use strict'
const nodemailer = require('nodemailer')

exports.sender = async (result) => {
    console.log('disini loh')
    const transporter = nodemailer.createTransport({
        service: result.service || 'gmail',
        host: result.host || 'smtp.gmail.com',
        port: result.port || 587,
        auth: {
            user: result.sender || 'ragilmanggalaning42@gmail.com',
            pass: result.password || 'ManhajSalaf1'
        }
        // host: 'smtp.ethereal.email',
        // port: 587,
        // auth: {
        //     user: 'grayson.nolan@ethereal.email',
        //     pass: 'PTensjWjWEwBYpB3R3'
        // }
    })

    const send = await transporter.sendMail({
        from: `${result.from} <${result.sender}>`, // sender address
        to: result.receiver, // list of receivers
        subject: result.subject, // Subject line
        text: result.text, // plain text body
        html: result.html, // html body
    })
}