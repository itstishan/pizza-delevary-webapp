const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    // optional extra gallery images shown on the details page, beyond the primary `img` cover image
    images: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Product", ProductSchema)
