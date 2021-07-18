const User = require('../models/user-model')
const VideoGameList = require('../models/videogamelist-model')
const jwt = require("jsonwebtoken");
require('dotenv').config()

createUser = (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    user.save(function(err) {
        if (err) {
            res.status(500)
                .send("Error registering new user please try again.")
        } else {
            const vgList = new VideoGameList({username: username, name: "Default"})
            vgList.save(function (err) {
            })
            res.status(200).send("Welcome to the club!");
        }
    })
}

authenticateUser = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect username or password'
                });
        } else {
            user.isCorrectPassword(password, function(err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
                } else if (!same) {
                    res.status(401)
                        .json({
                            error: 'Incorrect username or password'
                        });
                } else {
                    // Issue token
                    const payload = { username };
                    const token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: '1h'
                    });
                    res.cookie('token', token, { httpOnly: true })
                        .sendStatus(200);
                }
            });
        }
    });
}

profileInfo = (req, res) => {
    const { user } = req.body
    User.findOne({ username: user }, function (err, userObj) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                })
        } else if (!userObj) {
            res.status(401)
                .json({
                    error: `No user with username = ${user}`
                });
        } else {
            res.status(200)
                .json({
                    join_date: new Date(userObj.createdAt).toDateString()
                })
        }
    })
}

// Check if user has good token
const withAuth = function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.username = decoded.username;
                next();
            }
        });
    }
}

checkToken = (req, res) => {
    res.sendStatus(200)
}

module.exports = {
    createUser,
    authenticateUser,
    withAuth,
    checkToken,
    profileInfo
}
