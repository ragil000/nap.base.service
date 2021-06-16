const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { isEmail } = require('validator')

const schemaModel = mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'Email already exist'],
        required: [true, 'Email cannot be empty'],
        validate: [isEmail, 'Email not valid']
    },
    password: {
        type: String,
        minLength: [6, 'Minimum password length is 6 characters'],
        required: [true, 'Password cannot be empty']
    },
    token: {
        type: String,
        default: mongoose.Types.ObjectId
    },
    status: {
        type: String,
        enum: ['verify', 'active', 'nonactive'],
        default: 'verify'
    },
    role: {
        type: String,
        enum: ['superAdmin', 'user'],
        default: 'user'
    },
    softDelete: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
})

schemaModel.plugin(mongoosePaginate)

const newSchema = mongoose.model('Account', schemaModel)
newSchema.paginate().then({})
module.exports = newSchema