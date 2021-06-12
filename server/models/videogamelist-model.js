const mongoose = require('mongoose')
const Schema = mongoose.Schema


const VideoGameList = new Schema ({
        username: { type: String, required: true },
        reviews : { type: [Schema.Types.ObjectId], required: true}
    },
    { timestamps: false},
)

module.exports = mongoose.model('videogamelist', VideoGameList)
