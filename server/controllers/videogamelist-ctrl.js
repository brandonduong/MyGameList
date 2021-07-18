const VideoGameList = require('../models/videogamelist-model')
const Review = require('../models/review-model')

addReview = async (req, res) => {
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

    await Review.findOne({username: req.username, list: body.list, gameId: body.gameId}, (err, review) => {
        if (review) {
            return res.status(401).json({ success: false, error: 'Review for game in list already exists' })
        }
        else {
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
    }).catch(err => console.log(err))
}

updateReview = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Review.findOne({ _id: req.params.id, username: req.username }, (err, review) => {
        if (err || !review) {
            return res.status(404).json({
                err,
                message: 'Review not found!',
            })
        }
        if (body.rating) {
            review.rating = body.rating
        }
        else if (body.thoughts) {
            review.thoughts = body.thoughts
        }
        review
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Review updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Review not updated!',
                })
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

addList = async (req, res) => {
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

    await VideoGameList.findOne({name: body.name, username: req.username}, (err, list) => {
        if (list) {
            return res.status(400).json({success: false, error: 'List with name already exists'})
        }
        else {
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
    }).catch(err => console.log(err))
}

removeList = async (req, res) => {
    await VideoGameList.findOneAndDelete({name: req.params.list, username: req.username}, (err, list) => {
        if (err || !list) {
            return res.status(400).json({success: false, error: err})
        }
        else {
            Review.deleteMany({list : list.name}, (err) => {
                return res.status(200).json({success: true})
            })
        }
    }).catch(err => console.log(err))
}

module.exports = {
    addReview,
    getList,
    getLists,
    addList,
    removeList,
    updateReview
}
