const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const accountRoute = require('./app/routes/accountRoute')
const scheduleRoute = require('./app/routes/scheduleRoute')

const mongodbUri = process.env.MONGODB_URL 
mongoose.connect(`mongodb:${mongodbUri}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())
app.use('/publics', express.static('publics'))

// handle CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Language')
    if(request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return response.status(200).json({})
    }
    next()
})

app.use('/account', accountRoute)
app.use('/schedule', scheduleRoute)

// handle error
app.use((request, response, next) => {
    // console.log('ini', accountRoute)
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, request, response, next) => {
    response.status(error.status || 500)
    response.json({
        error: {
            message: error.message || 'Server error'
        }
    })
})

module.exports = app