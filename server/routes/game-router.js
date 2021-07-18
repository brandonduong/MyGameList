const express = require('express')

const GameCtrl =  require('../controllers/game-ctrl')

const router = express.Router()

router.post('/game', GameCtrl.gameInfo)
router.post('/search', GameCtrl.searchInfo)

/*
router.get('/home', function(req, res) {
    res.send('Welcome home!')
})
 */

module.exports = router
