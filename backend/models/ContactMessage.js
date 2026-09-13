const mongoose = require('mongoose')

const ContactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    subject: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("ContactMessage", ContactMessageSchema)
