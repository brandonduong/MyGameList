const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const router = express.Router()

router.post('/register', UserCtrl.createUser)
router.post('/authenticate', UserCtrl.authenticateUser)
router.get('/checkToken', UserCtrl.withAuth, UserCtrl.checkToken)
router.post('/profile', UserCtrl.profileInfo)

/*
router.get('/home', function(req, res) {
    res.send('Welcome home!')
})
 */

module.exports = router
