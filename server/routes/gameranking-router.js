const express = require('express')

const GameRankingCtrl =  require('../controllers/gameranking-ctrl')

const router = express.Router()

router.get('/gameRanking/:gameId', GameRankingCtrl.getGameRanking)

/*
router.get('/home', function(req, res) {
    res.send('Welcome home!')
})
 */

module.exports = router
