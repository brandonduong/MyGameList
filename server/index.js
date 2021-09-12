const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const userRouter = require('./routes/user-router')
const videogamelistRouter = require('./routes/video-game-list-router')
const reviewRouter = require('./routes/review-router')
const gameRouter = require('./routes/game-router')
const gameRankingRouter = require('./routes/gameranking-router')
const cookieParser = require('cookie-parser')
const path = require("path");

const app = express()
const apiPort = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "build")))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api', userRouter)
app.use('/api', videogamelistRouter)
app.use('/api', reviewRouter)
app.use('/api', gameRouter)
app.use('/api', gameRankingRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
