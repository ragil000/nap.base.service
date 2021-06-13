const amqp = require('amqplib')
const sender = require('../models/senderEmail')

exports.send = async () => {
    let data = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        sender: 'ragilmanggalaning42@gmail.com',
        password: 'ManhajSalaf1',
        from: 'Ragil',
        receiver: 'dev03@bestada.co.id',
        subject: 'test',
        text: 'Testing saja',
        html: '<h1>Hallo gaess!</h1>'
    }

    try {
        console.log('masuk')
        await sender.sender(data)
        console.log('selesai')
        // const connection = await amqp.connect(process.env.RABBITMQ_URI)
        // const channel = await connection.createChannel()
        // await channel.assertQueue(process.env.QUEUE)
        // channel.sendToQueue(process.env.QUEUE, Buffer.from(JSON.stringify(data)))
    }catch(error) {
        console.log('failed ', data, error)
    }
}