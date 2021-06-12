const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Review = new Schema ({
    username: { type: String, required: true },
    rating: { type: Number, required: true },
    thoughts: { type: String, required: false },
    title: { type: String, required: true},
    gameId: { type: Number, required: true },
    hours: {type: Number, required: false}
    },
    { timestamps: true }
)

module.exports = mongoose.model('reviews', Review)
