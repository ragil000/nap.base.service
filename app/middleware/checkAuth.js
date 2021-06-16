const jwt = require('jsonwebtoken')
const Account = require('../models/accountModel')
const { array } = require('joi')

// check json web token exists
const requireAuth = async (request, response, next) => {
    let token = request.headers.authorization || null
    if(!token) {
        return response.status(403).json({
            status: false,
            message: 'Access denied, login session/cookie is required to access this request'
        })
    }
    token = token.split(' ')

    if(token[0] != 'Bearer') {
        return response.status(403).json({
            status: false,
            message: 'Access denied, \'Bearer\' is required'
        })
    }

    try{
        const decoded = jwt.verify(token[1], process.env.JWT_KEY)
        const account = await Account.findOne({
            $and: [
                {
                    _id: decoded.id
                },
                {
                    status: 'active'
                },
                {
                    role: {
                        $in: ['user', 'superAdmin']
                    }
                }
            ]
        })
        if(account) {
            response.accountData = {
                'id': account._id,
                'email': account.email,
                'status': account.status,
                'role': account.role
            }
        }else {
            response.accountData = null
        }
        next()
    }catch(error) {
        return response.status(403).json({
            status: false,
            message: 'Access denied, login session/cookie is required to access this request'
        })
    }
}

// check status and role account
const checkRoleAccount = (...role) => {
    return (request, response, next) => {
        if(!role.includes(response.accountData.status) || !role.includes(response.accountData.role)) {
            return response.status(403).json({
                status: false,
                message: 'Access denied, account role/level/status cannot access this request'
            })
        }
        next()
    }
}

module.exports = { requireAuth, checkRoleAccount }