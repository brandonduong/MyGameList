const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')
const ReviewCtrl = require('../controllers/review-ctrl')

const router = express.Router()

router.post('/addToList', UserCtrl.withAuth, ReviewCtrl.addReview)
router.put('/updateReview/:id', UserCtrl.withAuth, ReviewCtrl.updateReview)
router.delete('/removeReview/:id', UserCtrl.withAuth, ReviewCtrl.removeReview)
router.put('/helpfulReview', UserCtrl.withAuth, ReviewCtrl.helpfulReview)

/*
router.get('/home', function(req, res) {
    res.send('Welcome home!')
})
 */

module.exports = router
