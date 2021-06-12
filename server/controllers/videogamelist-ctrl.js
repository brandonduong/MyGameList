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
    await Review.find({username: req.params.user}, (err, reviews) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: reviews })
    }).catch(err => console.log(err))
}

module.exports = {
    addReview,
    getList
}
