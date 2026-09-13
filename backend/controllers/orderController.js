const orderController = require("express").Router()
const Order = require("../models/Order")
const SHIPPING_COST = 30

// create order (checkout)
orderController.post('/', async (req, res) => {
    try {
        const { items, shippingAddress } = req.body

        if(!Array.isArray(items) || items.length === 0){
            return res.status(400).json({msg: "Cart is empty"})
        }
        if(!shippingAddress){
            return res.status(400).json({msg: "Shipping address is required"})
        }

        const subtotal = items.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
        )
        const totalAmount = subtotal + SHIPPING_COST

        const order = await Order.create({
            items,
            shippingAddress,
            subtotal,
            shippingCost: SHIPPING_COST,
            totalAmount,
        })

        return res.status(201).json(order)
    } catch (error) {
        console.error(error)
        return res.status(400).json({msg: error.message})
    }
})

// get one order (e.g. for an order confirmation page)
orderController.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(404).json({msg: "Order not found"})
        }
        return res.status(200).json(order)
    } catch (error) {
        console.error(error)
        return res.status(400).json({msg: "Invalid order id"})
    }
})

module.exports = orderController
