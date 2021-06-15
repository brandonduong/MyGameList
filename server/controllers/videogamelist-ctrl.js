const VideoGameList = require('../models/videogamelist-model')
const Review = require('../models/review-model')

addReview = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide game + listing information.',
        })
    }
    // Check if user owns resource they are trying to manipulate
    else if (body.username && req.username !== body.username) {
        return res.status(400).json({
            success: false,
            error: 'Trying to create review for an account you do not own.',
        })
    }

    // username, rating, thoughts, game, hours
    const listing = new Review(body)

    if (!listing) {
        return res.status(400).json({ success: false, error: err })
    }

    listing
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'Review created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Review not created!',
            })
        })
}

getList = async (req, res) => {
    await Review.find({username: req.params.user, list: req.params.list}, (err, reviews) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: reviews })
    }).catch(err => console.log(err))
}

getLists = async (req, res) => {
    await VideoGameList.find({username: req.params.user}, (err, lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: lists })
    }).catch(err => console.log(err))
}

addList = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide list name.',
        })
    }
    // Check if user owns resource they are trying to manipulate
    else if (body.username && req.username !== body.username) {
        return res.status(400).json({
            success: false,
            error: 'Trying to create list for an account you do not own.',
        })
    }

    // username, rating, thoughts, game, hours
    const list = new VideoGameList(body)

    if (!list) {
        return res.status(400).json({ success: false, error: err })
    }

    list
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'List created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'List not created!',
            })
        })
}

removeList = async (req, res) => {
    await VideoGameList.findOneAndDelete({name: req.params.list, username: req.username}, (err, list) => {
        if (err) {
            return res.status(400).json({success: false, error: err})
        }

        return res.status(200).json({success: true})
    }).catch(err => console.log(err))
}

module.exports = {
    addReview,
    getList,
    getLists,
    addList,
    removeList
}
