const express = require('express')
const router = express.Router()
const Controller = require('../controllers/scheduleController')
const checkAPIKEY = require('../middleware/checkAPIKEY')
const {requireAuth, checkRoleAccount} = require('../middleware/checkAuth')

router.get('/', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.read)

router.post('/', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.create)

router.put('/', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.update)

router.delete('/', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.delete)

module.exports = router