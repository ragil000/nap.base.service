const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Account = require('../models/accountModel')
const sanitize = require('mongo-sanitize')
const mongoose = require('mongoose')
const RmyHelpers = require('../helpers/rmyHelper')

// create json web token
const maxAge = 3 * 24 * 60 * 60
const createToken = (data) => {
  return jwt.sign({ id: data._id, status: data.status }, process.env.JWT_KEY, {
    expiresIn: maxAge
  })
}

const generateRandomCharacters = (length=12) => {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$@'
    let randomCharacters = ''
    for (let i = 0; i < length; i++ ) {
        randomCharacters += characters[Math.floor(Math.random() * characters.length)]
    } 
    return randomCharacters
}

exports.account_get = async (request, response, next) => {
    try {
        const page = request.query.page || 1
        const limit = request.query.limit || 10
        const id = request.query.id || null

        let getData
        if(id) {
            getData = await Account.findOne({ $and: [{ _id: mongoose.Types.ObjectId(id) }, { softDelete: { $eq: null } }] })
            if(getData) {
                response.status(200).json({
                    status: true,
                    message: 'Account was fetched',
                    data: {
                        _id: getData._id,
                        email: getData.email,
                        status: getData.status,
                        role: getData.role,
                        createdAt: RmyHelpers.mongooseTimestampToGMT(getData.createdAt),
                        updatedAt: RmyHelpers.mongooseTimestampToGMT(getData.updatedAt)
                    }
                })
            }else {
                return response.status(200).json({
                    status: false,
                    message: 'Data is empty'
                })
            }
        }else {
            getData = await Account.paginate({ _id: { $ne: response.accountData.id }, softDelete: null }, { page: page, limit: limit })
            if(getData.docs.length) {
                response.status(200).json({
                    status: true,
                    message: 'Accounts wa fetched',
                    data: getData.docs.map((result) => {
                        return {
                            _id: result._id,
                            email: result.email,
                            status: result.status,
                            role: result.role,
                            createdAt: RmyHelpers.mongooseTimestampToGMT(result.createdAt),
                            updatedAt: RmyHelpers.mongooseTimestampToGMT(result.updatedAt)
                        }
                    }),
                    totalData: getData.totalDocs,
                    limit: getData.limit,
                    totalPages: getData.totalPages,
                    page: getData.page,
                    pagingCounter: getData.pagingCounter,
                    hasPrevPage: getData.hasPrevPage,
                    hasNextPage: getData.hasNextPage,
                    prevPage: getData.prevPage,
                    nextPage: getData.nextPage
                })
            }else {
                return response.status(200).json({
                    status: false,
                    message: 'Data is empty'
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

exports.account_signup = async (request, response, next) => {
    try {
        const findUsername = await Account.findOne({ email: sanitize(request.body.email), softDelete: null })
        if(findUsername) {
            return response.status(409).json({
                status: false,
                message: "This email already exist"
            })
        }else {
            try {
                const token = generateRandomCharacters()
                try {
                    const salt = await bcrypt.genSalt()
                    const passwordHash = await bcrypt.hash(request.body.password, salt)
                    const createData = await Account.create({
                        email: sanitize(request.body.email),
                        password: passwordHash,
                        role: sanitize(request.body.role),
                        status: 'active',
                        token: token
                    })
                    if(createData) {
                        try {
                            // createData['link'] = request.body.link
                            // await sender.send(createData)
                            response.status(201).json({
                                status: true,
                                message: 'Account was created, check email to activate',
                                data: {
                                    _id: createData._id,
                                    email: createData.email,
                                    role: createData.role,
                                    status: createData.status,
                                    token: createData.token
                                }
                            })
                        }catch(error) {
                            await Account.deleteOne({ _id: account.id })
                            return response.status(500).json({
                                status: false,
                                message: error.message
                            })
                        }
                    }
                }catch(error) {
                    return response.status(500).json({
                        status: false,
                        message: error.message
                    })
                }
            }catch(error) {
                return response.status(500).json({
                    status: false,
                    message: error.message
                })
            }
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_verify = async (request, response, next) => {
    try {
        const token = request.query.token || null
        const findUser = await Account.findOne({ token: token })
        if(findUser) {
            if(findUser.status === 'active') {
                return response.status(200).json({
                    status: true,
                    message: 'Account has been active'
                })
            }else if(findUser.status === 'verify') {
                const updateData = await Account.updateOne({ _id: findUser._id }, { $set: { status: 'active' } })
                response.status(200).json({
                    status: true,
                    message: 'Account has been active'
                })
            }else if(findUser.status === 'nonactive') {
                return response.status(401).json({
                    status: false,
                    message: 'Account has been nonactived'
                })
            }else {
                return response.status(403).json({
                    status: false,
                    message: 'Account status unrecognized'
                })
            }
        }else {
            return response.status(403).json({
                status: false,
                message: 'Access denied, token unrecognized'
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_signin = async (request, response, next) => {
    try {
        const findEmail = await Account.findOne({ email: sanitize(request.body.email), softDelete: null })
        if(findEmail) {
            if(findEmail.status === 'verify') {
                return response.status(401).json({
                    status: false,
                    message: 'Account has not verified, check the account email'
                })
            }else if(findEmail.status === 'nonactive') {
                return response.status(401).json({
                    status: false,
                    message: 'Account has been nonactived'
                })
            }else if(findEmail.status === 'active') {
                try {
                    const auth = await bcrypt.compare(request.body.password, findEmail.password)
                    if(auth) {
                        const token = createToken(findEmail)
                        response.status(200).json({
                            status: true,
                            token: token,
                            email: findEmail.email,
                            accountStatus: findEmail.status,
                            accountRole: findEmail.role,
                            message: 'Auth successful'
                        })
                    }else {
                        return response.status(401).json({
                            status: false,
                            message: 'Password not valid'
                        })
                    }
                }catch(error) {
                    return response.status(500).json({
                        status: false,
                        message: error.message
                    })
                }
            }else {
                return response.status(403).json({
                    status: false,
                    message: 'Account status has not recognized'
                })
            }
        }else {
            return response.status(401).json({
                status: false,
                message: 'Email has not been registered'
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_put = async (request, response, next) => {
    try {
        const id = request.query.id || null
        if(!id) {
            return response.status(400).json({
                status: false,
                message: 'id param required'
            })
        }

        const findAccount = await Account.findOne({ _id: mongoose.Types.ObjectId(id), softDelete: null })
        if(findAccount) {
            const auth = await bcrypt.compare(request.body.passwordOld, findAccount.password)
            if(auth) {
                let updateData = {}
                if(sanitize(request.body.email)) {
                    if(request.body.password) {
                        try {
                            const salt = await bcrypt.genSalt()
                            const passwordHash = await bcrypt.hash(request.body.password, salt)
                            updateData = {
                                email: sanitize(request.body.email),
                                password: passwordHash
                            }
                        }catch(error) {
                            return response.status(500).json({
                                status: false,
                                message: error.message
                            })
                        }
                    }else {
                        updateData = {
                            email: sanitize(request.body.email)
                        }
                    }
                    try {
                        const update = await Account.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: updateData })
                        response.status(200).json({
                            status: true,
                            message: 'Account was updated'
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
                        message: 'email is required'
                    })
                }
            }else {
                return response.status(403).json({
                    status: false,
                    message: 'Passwords do not match'
                })
            }
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

exports.account_delete = async (request, response, next) => {
    try {
        const id = request.query.id || null
        const hard = request.query.hard || ''
        if(!id) {
            return response.status(400).json({
                status: false,
                message: 'id param required'
            })
        }
        const findAccount = await Account.findOne({ _id: mongoose.Types.ObjectId(id) })
        if(findAccount) {
            try {
                let deleteData
                if(hard == 'yes') {
                    deleteData = await Account.deleteOne({ _id: mongoose.Types.ObjectId(id) })
                }else {
                    deleteData = await Account.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { softDelete: Date.now() } })
                }
                response.status(200).json({
                    status: true,
                    message: "Account was deleted"
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