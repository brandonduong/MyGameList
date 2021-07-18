const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')
const VideoGameListCtrl = require('../controllers/videogamelist-ctrl')

const router = express.Router()

router.post('/addToList', UserCtrl.withAuth, VideoGameListCtrl.addReview)
router.get('/getList/:user.:list', VideoGameListCtrl.getList)
router.get('/getLists/:user', VideoGameListCtrl.getLists)
router.post('/addList', UserCtrl.withAuth, VideoGameListCtrl.addList)
router.delete('/removeList/:list', UserCtrl.withAuth, VideoGameListCtrl.removeList)
router.put('/updateReview/:id', UserCtrl.withAuth, VideoGameListCtrl.updateReview)

/*
router.get('/home', function(req, res) {
    res.send('Welcome home!')
})
 */

module.exports = router
