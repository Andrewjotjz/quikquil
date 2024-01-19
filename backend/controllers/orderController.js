//import modules
const order = require('../models/orderModel');
const mongoose = require('mongoose');

const getAllOrders = async (req,res) => {
    //create a new Product model using find() and sort descending order
    const Order = await order.find({}).sort({createdAt: -1})
    res.status(200).json(Order)
}

const getSingleOrder = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Order = await order.findById(id)

    if (!Order) {
        res.status(400).json({mssg: "No such order"})
    }

    else {
        res.status(200).json(Order)
    }
}

const createNewOrder = async (req,res) => {
    const { Order_No, Project_ID, Location, Order_date, Delivery_datetime, Products } = req.body
        
    try {
        const Order = await order.create({ Order_No, Project_ID, Location, Order_date, Delivery_datetime, Products })
            res.status(200).json(Order)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
    
}

const deleteSingleOrder = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Order = await order.findOneAndDelete({_id: id})

    if (!Order) {
        res.status(400).json({mssg: "No such product"})
    }

    else {
        res.status(200).json(Order)
    }
}

const updateSingleOrder = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Order = await order.findOneAndUpdate({_id: id}, {...req.body})

    if (!Order) {
        res.status(400).json({mssg: "No such order"})
    }

    else {
        res.status(200).json(Order)
    }
    
}

module.exports = {getAllOrders,getSingleOrder,createNewOrder,updateSingleOrder,deleteSingleOrder }