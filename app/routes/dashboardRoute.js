const express = require('express')
const router = express.Router()
const Controller = require('../controllers/dashboardController')
const checkAPIKEY = require('../middleware/checkAPIKEY')
const {requireAuth, checkRoleAccount} = require('../middleware/checkAuth')

router.get('/readSchedule', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.readSchedule)
router.get('/readStatisticSchedule', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.readStatisticSchedule)

router.get('/readAccount', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.readAccount)
router.get('/readStatisticAccount', checkAPIKEY, requireAuth, checkRoleAccount('active', 'user', 'superAdmin'), Controller.readStatisticAccount)

module.exports = router