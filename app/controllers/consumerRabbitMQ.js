const amqp = require('amqplib')
const senderEmail = require('../models/senderEmail')
const requeuer = require('../models/requeueRabbitMQ')


exports.consumer = async () =>  {
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost')
        const channel = await connection.createChannel()
        await channel.assertQueue(process.env.QUEUE || 'mailers')

        channel.consume(process.env.QUEUE || 'mailers', (data) => {
            const results = JSON.parse(data.content.toString())
            if(Array.isArray(results)) {
                results.forEach(async (result) => {
                    try{
                        await senderEmail.sender(result)
                        console.log('email has been sent')
                    }catch(error) {
                        console.log('email failed to send', error)
                        // try{
                        //     await requeuer.requeue(result)
                        //     console.log('email requeue', result)
                        // }catch(error) {
                        //     console.log('email failed to requeue', result)
                        // }
                    }
                })
            }else {
                async function sender() {
                    try{
                        await senderEmail.sender(results)
                        console.log('email has been sent')
                    }catch(error) {
                        console.log('email failed to send', error)
                        // try{
                        //     await requeuer.requeue(results)
                        //     console.log('email requeue', results)
                        // }catch(error) {
                        //     console.log('email failed to requeue', results)
                        // }
                    }
                }
                sender()
            }
        }, {
            noAck: true
        })
    }catch(error) {
        console.log('connection to rabbitmq error', error)
    }
}