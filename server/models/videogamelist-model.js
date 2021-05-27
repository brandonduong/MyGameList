const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('review-model')

const VideoGameList = new Schema ({
        owner: { type: String, required: true },
        reviews : { type: [Review], required: true}
    },
    { timestamps: false},
)

module.exports = mongoose.model('videogamelist', VideoGameList)
