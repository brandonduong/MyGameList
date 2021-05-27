const User = require('../models/user-model')

createUser = (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    user.save(function(err) {
        if (err) {
            res.status(500)
                .send("Error registering new user please try again.");
        } else {
            res.status(200).send("Welcome to the club!");
        }
    })
}

module.exports = {
    createUser,
}
