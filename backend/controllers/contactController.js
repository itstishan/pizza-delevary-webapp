const contactController = require("express").Router()
const ContactMessage = require("../models/ContactMessage")

// submit a contact message
contactController.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body

        if (!name || !email || !message) {
            return res.status(400).json({ msg: "name, email and message are required" })
        }

        const contactMessage = await ContactMessage.create({ name, email, subject, message })
        return res.status(201).json(contactMessage)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: error.message })
    }
})

module.exports = contactController
