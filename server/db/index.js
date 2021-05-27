const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/myvideogamelist', {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(e => {
        console.error('Connection Error', e.message)
    })

const db = mongoose.connection

module.exports = db
