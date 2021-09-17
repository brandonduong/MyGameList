const Review = require('../models/review-model')
const VideoGame = require('../models/gameranking-model')

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
                    updateGameScore(body.gameId, listing)
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

async function updateGameScore(gameId, review){
    VideoGame.findOne({gameId: gameId},(err, game) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Error retrieving game',
            })
        } else if (!game) {
            console.log('Creating new entry')
            const newGame = new VideoGame({gameId: gameId, rating: review.rating, members: 1, cumulativeHours: review.hours})
            newGame.save()
        } else if (game) {
            // Get all reviews of gameId to calculate score + members + ranking
            console.log('found game')
            Review.find({gameId: gameId}, {rating: 1, hours: 1, username: 1}, (err, reviews) => {
                const reviewers = new Set();
                let totalRating = 0;
                let totalHours = 0;
                reviews.forEach((review) => {
                    // Only include 1 rating from each user
                    console.log(review)
                    if (!reviewers.has(review.username)) {
                        totalRating += review.rating;
                        totalHours += review.hours
                        reviewers.add(review.username);
                    }
                });

                // Round rating 2 decimals
                game.rating = 0;
                if (reviewers.size > 0) {
                    game.rating = Math.round(((totalRating / reviewers.size) + Number.EPSILON) * 100) / 100
                }
                game.members = reviewers.size
                game.locked = false
                game.cumulativeHours = Math.round(((totalHours) + Number.EPSILON) * 100) / 100
                game.save()
            }).catch(err => console.log(err))
        }
    })
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
        let updateRating = false;
        if (err || !review) {
            return res.status(404).json({
                err,
                message: 'Review not found!',
            })
        }
        if (body.rating) {
            updateRating = true;
            review.rating = body.rating
        } else if (body.thoughts) {
            review.thoughts = body.thoughts
        } else if (body.hours) {
            updateRating = true;
            review.hours = body.hours
        } else if (body.status) {
            review.status = body.status
        }
        review
            .save()
            .then(() => {
                if (updateRating) {
                    updateGameScore(review.gameId)
                }
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

removeReview = async (req, res) => {
    await Review.findOneAndDelete({ _id: req.params.id, username: req.username }, (err, review) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!review) {
            return res
                .status(404)
                .json({ success: false, error: `Review not found` })
        } else {
            updateGameScore(review.gameId)
        }

        return res.status(200).json({ success: true })
    }).catch(err => console.log(err))
}

helpfulReview = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Review.findOne({ _id: body.id }, (err, review) => {
        if (err || !review) {
            return res.status(404).json({
                err,
                message: 'Review not found!',
            })
        }

        // Only add user if they haven't found this review helpful before
        if (!review.helpful.includes(req.username) && body.helpful) {
            review.helpful.push(req.username)
            review
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: 'Review liked!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Review not liked!',
                    })
                })
        } else if (review.helpful.includes(req.username) && !body.helpful) {
            const index = review.helpful.indexOf(req.username);
            if (index > -1) {
                review.helpful.splice(index, 1);
            }
            review
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: 'Review unliked!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Review not unliked!',
                    })
                })
        } else {
            return res.status(404).json({
            success: false,
            message: 'Review not changed!',
        })}
    })
}

module.exports = {
    addReview,
    updateReview,
    removeReview,
    helpfulReview
}
