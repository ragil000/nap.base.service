const amqp = require('amqplib')

exports.requeue = async (result) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost')
        const channel = await connection.createChannel()
        await channel.assertQueue(process.env.QUEUE || 'mailers')
        channel.sendToQueue(process.env.QUEUE || 'mailers', Buffer.from(JSON.stringify(result)))
    }catch(error) {
        console.log('failed to requeue', result)
    }
}