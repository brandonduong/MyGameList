const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const userRouter = require('./routes/user-router')
const videogamelistRouter = require('./routes/video-game-list-router')
const gameRouter = require('./routes/game-router')
const cookieParser = require('cookie-parser')

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', userRouter)
app.use('/api', videogamelistRouter)
app.use('/api', gameRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
