const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const checkAPIKEY = require('../middleware/checkAPIKEY')
const {requireAuth, checkRoleAccount} = require('../middleware/checkAuth')

router.get('/verify', checkAPIKEY, accountController.account_verify)

router.get('/', checkAPIKEY, requireAuth,  checkRoleAccount('active', 'superAdmin'), accountController.account_get)

router.post('/signup', checkAPIKEY, accountController.account_signup)

router.post('/signin', checkAPIKEY, accountController.account_signin)

router.put('/', checkAPIKEY, requireAuth, checkRoleAccount('active', 'superAdmin'), accountController.account_put)

router.delete('/', checkAPIKEY, requireAuth, checkRoleAccount('active', 'superAdmin'), accountController.account_delete)

module.exports = router