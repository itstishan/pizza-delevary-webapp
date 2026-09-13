const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    items: {
        type: [
            {
                productId: { type: String, required: true },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
            }
        ],
        required: true,
        validate: {
            validator: (items) => Array.isArray(items) && items.length > 0,
            message: 'An order must contain at least one item',
        }
    },
    shippingAddress: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true })

module.exports = mongoose.model("Order", OrderSchema)
