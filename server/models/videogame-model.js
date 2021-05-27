const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('review-model')

const VideoGame = new Schema ({
    title: { type: String, required: true },
    rating: { type: Number, required: true},
    description: { type: String, required: false},
    reviews : { type: [Review], required: false}
    },
    { timestamps: false},
)

module.exports = mongoose.model('videogames', VideoGame)
