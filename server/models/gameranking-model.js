const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoGame = new Schema ({
        gameId: { type: Number, required: true },
        rating: { type: Number, required: true, default: 0},
        members: { type: Number, required: true, default: 0},
        cumulativeHours: { type: Number, required: true, default: 0},
    },
    { timestamps: false},
)

module.exports = mongoose.model('videogames', VideoGame)
