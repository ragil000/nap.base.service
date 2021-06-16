const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Model = require('../models/scheduleModel')
const sanitize = require('mongo-sanitize')
const mongoose = require('mongoose')
const RmyHelpers = require('../helpers/rmyHelper')

exports.read = async (request, response, next) => {
    try {
        const page = request.query.page || 1
        const limit = request.query.limit || 10
        const id = request.query.id || null

        let readData
        if(id) {
            readData = await Model.findOne({ $and: [{ _id: mongoose.Types.ObjectId(id) }, { softDelete: { $eq: null } }] }).populate('createdBy')
            if(readData) {
                response.status(200).json({
                    status: true,
                    message: 'data was fetched',
                    data: {
                        _id: readData._id,
                        receivers: readData.receivers,
                        message: readData.message,
                        platform: readData.platform,
                        scheduleType: readData.scheduleType,
                        scheduleTime: readData.scheduleTime,
                        createdBy: readData.createdBy ? readData.createdBy.email : null,
                        createdAt: RmyHelpers.mongooseTimestampToGMT(readData.createdAt),
                        updatedAt: RmyHelpers.mongooseTimestampToGMT(readData.updatedAt)
                    }
                })
            }else {
                return response.status(200).json({
                    status: false,
                    message: 'Data is empty'
                })
            }
        }else {
            readData = await Model.paginate({ softDelete: null }, { page: page, limit: limit, populate: {
                    path: 'createdBy',
                    model: 'Account'
                }
            })
            if(readData.docs.length) {
                response.status(200).json({
                    status: true,
                    message: 'data wa fetched',
                    data: readData.docs.map((data) => {
                        return {
                            _id: data._id,
                            receivers: data.receivers,
                            message: data.message,
                            platform: data.platform,
                            scheduleType: data.scheduleType,
                            scheduleTime: data.scheduleTime,
                            createdBy: data.createdBy ? data.createdBy.email : null,
                            createdAt: RmyHelpers.mongooseTimestampToGMT(data.createdAt),
                            updatedAt: RmyHelpers.mongooseTimestampToGMT(data.updatedAt)
                        }
                    }),
                    totalData: readData.totalDocs,
                    limit: readData.limit,
                    totalPages: readData.totalPages,
                    page: readData.page
                })
            }else {
                return response.status(200).json({
                    status: false,
                    message: 'data is empty'
                })
            }
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.create = async (request, response, next) => {
    try {
        const createData = await Model.create({
            receivers: Array.isArray(request.body.receivers) ? request.body.receivers : [request.body.receivers],
            receiversCount: Array.isArray(request.body.receivers) ? request.body.receivers.length : 1,
            message: request.body.message,
            platform: request.body.platform,
            scheduleType: request.body.scheduleType,
            scheduleTime: {
                hours: request.body.hours,
                minutes: request.body.minutes,
                days: request.body.days
            },
            createdBy: response.accountData.id
        })

        response.status(201).json({
            status: true,
            message: 'data was created',
        })
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.update = async (request, response, next) => {
    try {
        const id = request.query.id || null
        if(!id) {
            return response.status(400).json({
                status: false,
                message: 'id param required'
            })
        }

        const checkId = await Model.findOne({ _id: mongoose.Types.ObjectId(id), softDelete: null })
        if(checkId) {
            const newData = {
                receivers: request.body.receivers,
                message: request.body.message,
                platform: request.body.platform,
                scheduleType: request.body.scheduleType,
                scheduleTime: {
                    hours: request.body.hours,
                    minutes: request.body.minutes,
                    days: request.body.days
                }
            }
            const updateData = await Model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: newData })
            response.status(200).json({
                status: true,
                message: 'data was updated'
            })
        }else {
            return response.status(404).json({
                status: false,
                message: `User id ${id} not found`
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.delete = async (request, response, next) => {
    try {
        const id = request.query.id || null
        const hard = request.query.hard || ''
        if(!id) {
            return response.status(400).json({
                status: false,
                message: 'id param required'
            })
        }
        const checkId = await Model.findOne({ _id: mongoose.Types.ObjectId(id), softDelete: null })
        if(checkId) {
            try {
                let deleteData
                if(hard == 'yes') {
                    deleteData = await Model.deleteOne({ _id: mongoose.Types.ObjectId(id) })
                }else {
                    deleteData = await Model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { softDelete: Date.now() } })
                }
                response.status(200).json({
                    status: true,
                    message: "data was deleted"
                })
            }catch(error) {
                return response.status(500).json({
                    status: false,
                    message: error.message
                })
            }
        }else {
            return response.status(401).json({
                status: false,
                message: `This account id ${id} not found`
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}