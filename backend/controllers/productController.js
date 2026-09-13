const productController = require("express").Router()
const Product = require("../models/Product")
const {verifyToken, verifyTokenAdmin} = require('../middllewares/verifyToken')

//get all
productController.get('/', async(req, res) => {
    try {
        // only allow filtering by category - never pass the raw query into Mongo (NoSQL injection risk)
        const filter = {}
        if(req.query.category) filter.category = req.query.category

        const products = await Product.find(filter)
        return res.status(200).json(products)
    }catch (error) {
        console.error(error)
        return res.status(500).json({msg: "Internal Server Error"})
    }
})

//get one
productController.get('/find/:id', async(req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({msg: "No product with such id!"})
        }
        return res.status(200).json(product)

     }catch (error) {
        console.error(error)
        return res.status(400).json({msg: "Invalid product id"})
    }
})

//create product
productController.post('/', verifyTokenAdmin, async(req, res) => {
    try {
        const {title, description, price, img, images, category} = req.body
        const newProduct = await Product.create({title, description, price, img, images, category})
        return res.status(201).json(newProduct)

    }catch (error) {
        console.error(error)
        return res.status(400).json({msg: error.message})
    }
})

//update product
productController.put('/update/:id', verifyTokenAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        const { title, description, price, category } = req.body;
        const updateProduct = {
            title,
            description,
            price,
            category
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateProduct, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
})

//delete product
productController.delete('/delete/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        return res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
})

module.exports = productController
