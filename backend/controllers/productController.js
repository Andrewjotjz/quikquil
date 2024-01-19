//import modules
const product = require('../models/productModel');
const mongoose = require('mongoose');

const getAllProducts = async (req,res) => {
    //create a new Product model using find() and sort in descending order
    const Product = await product.find({}).sort({createdAt: -1})
    res.status(200).json(Product)
}

const getSingleProduct = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Product = await product.findById(id)

    if (!Product) {
        res.status(400).json({mssg: "No such product"})
    }

    else {
        res.status(200).json(Product)
    }
}

const createNewProduct = async (req,res) => {
    const { Product_Code, Product_Name, Supplier_Name, 
        Product_UOM, Rate_Ex_GST, Installation_Category } = req.body
        
    try {
        const Product = await product.create({Product_Code, Product_Name, Supplier_Name,
            Product_UOM, Rate_Ex_GST, Installation_Category})
            res.status(200).json(Product)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
    
}

const deleteSingleProduct = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Product = await product.findOneAndDelete({_id: id})

    if (!Product) {
        res.status(400).json({mssg: "No such product"})
    }

    else {
        res.status(200).json(Product)
    }
}

const updateSingleProduct = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Product = await product.findOneAndUpdate({_id: id}, {...req.body})

    if (!Product) {
        res.status(400).json({mssg: "No such product"})
    }

    else {
        res.status(200).json(Product)
    }
    
}

module.exports = { getAllProducts, getSingleProduct, createNewProduct, deleteSingleProduct, updateSingleProduct }