const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schemaModel = mongoose.Schema({
    receivers: {
        type: Array,
        validate: [value => Array.isArray(value) && value.length > 0, 'receivers cannot be empty']
    },
    receiversCount: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    },
    message: {
        type: String,
        minLength: [6, 'Minimum message text length is 6 characters'],
        required: [true, 'message cannot be empty']
    },
    platform: {
        type: String,
        enum: ['whatsapp', 'email', 'telegram'],
        required: [true, 'platform cannot be empty']
    },
    scheduleType: {
        type: String,
        enum: ['repeated', 'nonRepeated'],
        default: 'nonRepeated'
    },
    scheduleTime: {
        type: {
            hours: {
                type: Number,
                get: v => Math.round(v),
                set: v => Math.round(v),
                alias: 'i'
            },
            minutes: {
                type: Number,
                get: v => Math.round(v),
                set: v => Math.round(v),
                alias: 'i'
            },
            days: {
                type: Array
            }
        },
        required: [true, 'scheduleTime cannot be empty']
    },
    lastSent: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'createdBy cannot be empty']
    },
    status: {
        type: String,
        enum: ['active', 'nonactive'],
        default: 'active'
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

const newSchema = mongoose.model('Schedule', schemaModel)
newSchema.paginate().then({})
module.exports = newSchema