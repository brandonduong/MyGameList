const VideoGameList = require('../models/videogamelist-model')
const Review = require('../models/review-model')

getList = (req, res) => {
    Review.find({username: req.params.user, list: req.params.list}, (err, reviews) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json(reviews)
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

    // Max list name of 20 chars
    if (body.name.length > 20) {
        body.name = body.name.substring(0, 20);
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
    getList,
    getLists,
    addList,
    removeList,
}
