const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')
const GameCtrl =  require('../controllers/game-ctrl')
const VideoGameListCtrl = require('../controllers/videogamelist-ctrl')

const router = express.Router()

router.post('/register', UserCtrl.createUser)
router.post('/authenticate', UserCtrl.authenticateUser)
router.get('/checkToken', UserCtrl.withAuth, UserCtrl.checkToken)
router.post('/profile', UserCtrl.profileInfo)
router.post('/game', GameCtrl.gameInfo)
router.post('/search', GameCtrl.searchInfo)

router.post('/addToList', UserCtrl.withAuth, VideoGameListCtrl.addReview)
router.get('/getList/:user.:list', VideoGameListCtrl.getList)
router.get('/getLists/:user', VideoGameListCtrl.getLists)
router.post('/addList', UserCtrl.withAuth, VideoGameListCtrl.addList)
router.delete('/removeList/:list', UserCtrl.withAuth, VideoGameListCtrl.removeList)

router.get('/home', function(req, res) {
    res.send('Welcome home!')
})

module.exports = router
