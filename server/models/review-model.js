const mongoose = require('mongoose')
const Schema = mongoose.Schema
const VideoGame = require('videogame-model')

const Review = new Schema ({
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    thoughts: { type: String, required: false },
    game: { type: VideoGame, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model('reviews', Review)
