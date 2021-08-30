const VideoGame = require('../models/gameranking-model')

getGameRanking = async (req, res) => {
    await VideoGame.findOne({gameId: req.params.gameId}, (err, game) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, game: game })
    }).catch(err => console.log(err))
}

module.exports = {
    getGameRanking
}
