const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schedule = require('../models/scheduleModel')
const Account = require('../models/accountModel')
const sanitize = require('mongo-sanitize')
const mongoose = require('mongoose')
const RmyHelpers = require('../helpers/rmyHelper')

exports.readSchedule = async (request, response, next) => {
    try {
        const platform = request.query.platform || null
        const status = request.query.status || null
        let readData
        let query = {}
        query.softDelete = null
        query.status = 'active'
        if(platform) query.platform = platform
        if(status) query.status = status
        readData = await Schedule.find(query).populate('createdBy')
        if(readData.length) {
            response.status(200).json({
                status: true,
                message: 'data was fetched',
                data: readData.map((data) => {
                    return {
                        _id: data._id,
                        receivers: data.receivers,
                        message: data.message,
                        platform: data.platform,
                        scheduleType: data.scheduleType,
                        scheduleTime: data.scheduleTime,
                        status: data.status,
                        lastSent: data.lastSent,
                        createdBy: data.createdBy.email,
                    }
                }),
                total: readData.length
            })
        }else {
            return response.status(200).json({
                status: false,
                message: 'Data is empty'
            })
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.readStatisticSchedule = async (request, response, next) => {
    try {
        const status = request.query.status || null
        const platform = request.query.platform || null

        let query = {}
        query.softDelete = null
        if(status) {
            query.status = status
        }
        if(platform) {
            query.platform = platform
        }

        const readData = await Schedule.aggregate([
            {
                $match: query
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 7
            },
            {
                $group: {
                    _id: {
                      month: { $month: "$createdAt" },
                      date: { $dayOfMonth: "$createdAt" },
                      year: { $year: "$createdAt" }
                    }
                }
            }
        ])
        let dataCalculate = []
        if(readData.length) {
            for(let i=0; i < readData.length; i++) {
                const getGroupingData = await Schedule.aggregate([
                    {
                        $match: query
                    },
                    {
                        $addFields: {
                            year: {
                                $year: '$createdAt'
                            },
                            month: {
                                $month: '$createdAt'
                            },
                            date: {
                                $dayOfMonth: '$createdAt'
                            }
                        }
                    },
                    {
                        $match: {
                            year:readData[i]._id.year,
                            month:readData[i]._id.month,
                            date:readData[i]._id.date,
                        }
                    }
                ])
                
                dataCalculate.push({
                    'year': readData[i]._id.year,
                    'month': readData[i]._id.month,
                    'date': readData[i]._id.date,
                    'total': getGroupingData.length,
                    'data': getGroupingData.map((data) => {
                        return {
                            _id: data._id,
                            receivers: data.receivers,
                            scheduleType: data.scheduleType,
                            lastSent: data.lastSent,
                            status: data.status,
                            message: data.message,
                            scheduleTime: data.scheduleTime,
                            createdAt: data.createdAt
                        }
                    })
                })
            }

            response.status(200).json({
                status: true,
                message: 'data was fetched',
                data: dataCalculate
            })
        }else {
            return response.status(200).json({
                status: false,
                message: 'Data is empty'
            })
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.readAccount = async (request, response, next) => {
    try {
        const role = request.query.role || null
        let readData
        let query = {}
        query.softDelete = null
        query.status = 'active'
        if(role) query.role = role

        readData = await Account.find(query)
        if(readData.length) {
            response.status(200).json({
                status: true,
                message: 'data was fetched',
                data: readData.map((data) => {
                    return {
                        _id: data._id,
                        email: data.email,
                        role: data.role,
                        status: data.status
                    }
                }),
                total: readData.length
            })
        }else {
            return response.status(200).json({
                status: false,
                message: 'Data is empty'
            })
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.readStatisticAccount = async (request, response, next) => {
    try {
        const role = request.query.role || null
        const platform = request.query.platform || null

        let querySchedule = {}
        let queryAccount = {}
        querySchedule.softDelete = null
        if(platform) querySchedule.platform = platform

        queryAccount.softDelete = null
        if(role) queryAccount.role = role
        if(platform) queryAccount.platform = platform

        const readData = await Schedule.aggregate([
            {
                $match: querySchedule
            },
            {
                $group: {
                    _id: {
                      member: '$createdBy'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 7
            }
        ])
        let dataCalculate = []
        if(readData.length) {
            for(let i=0; i < readData.length; i++) {
                queryAccount._id = readData[i]._id.member
                const getGroupingData = await Account.find(queryAccount)
                
                dataCalculate.push({
                    'total': readData[i].count,
                    'data': getGroupingData.map((data) => {
                        return {
                            _id: data._id,
                            email: data.email,
                            role: data.role,
                            status: data.status,
                            createdAt: data.createdAt
                        }
                    })
                })
            }

            response.status(200).json({
                status: true,
                message: 'data was fetched',
                data: dataCalculate
            })
        }else {
            return response.status(200).json({
                status: false,
                message: 'Data is empty'
            })
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}