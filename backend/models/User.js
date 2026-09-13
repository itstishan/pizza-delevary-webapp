const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        // minlength/maxlength (not min/max, which are numeric-only) - this checks the hashed value, so real length validation happens pre-hash in the controller
        minlength: 6,
        maxlength: 200,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model("User", UserSchema)
