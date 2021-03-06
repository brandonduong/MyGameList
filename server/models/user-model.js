const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const saltRounds = 10;

const User = new Schema ({
    username: { type: String, required: true, unique: true, maxlength: 20},
    email: { type: String, required: true, unique: true, maxlength: 50},
    password: { type: String, required: true, maxlength: 50},
    bio: { type: String, required: false, maxlength: 500, default: 'Welcome to MyGameList!'}
    },
    { timestamps: true }
)

User.pre('save', function(next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
        bcrypt.hash(document.password, saltRounds,
            function(err, hashedPassword) {
                if (err) {
                    next(err);
                }
                else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

User.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', User);
