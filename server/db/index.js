const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/myvideogamelist'

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .catch(e => {
        console.error('Connection Error', e.message)
    })

const db = mongoose.connection

module.exports = db
