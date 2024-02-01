//import modules
const order_history = require('../models/order_historyModel');
const mongoose = require('mongoose');

const getAllHistoryOrders = async (req,res) => {
    //create a new Product model using find() and sort descending order
    const HistoryOrder = await order_history.find({}).sort({createdAt: -1})
    res.status(200).json(HistoryOrder)
}

const getSingleHistoryOrder = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({mssg: "ID is invalid"})
    }

    const HistoryOrder = await order_history.findById(id)

    if (!HistoryOrder) {
        res.status(400).json({mssg: "No such order history"})
    }

    else {
        res.status(200).json(HistoryOrder)
    }
}

const createNewHistoryOrder = async (req,res) => {
    const { Order_No, Project_ID, Location, Order_date, Delivery_datetime, Products, Order_update_reason, Order_update_comment } = req.body
        
    try {
        const HistoryOrder = await order_history.create({ Order_No, Project_ID, Location, Order_date, Delivery_datetime, Products, Order_update_reason, Order_update_comment })
            res.status(200).json(HistoryOrder)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
    
}

const deleteSingleHistoryOrder = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const HistoryOrder = await order_history.findOneAndDelete({_id: id})

    if (!HistoryOrder) {
        res.status(400).json({mssg: "No such product"})
    }

    else {
        res.status(200).json(HistoryOrder)
    }
}

const updateSingleHistoryOrder = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const HistoryOrder = await order_history.findOneAndUpdate({_id: id}, {...req.body})

    if (!HistoryOrder) {
        res.status(400).json({mssg: "No such order"})
    }

    else {
        res.status(200).json(HistoryOrder)
    }
    
}

module.exports = {getAllHistoryOrders,getSingleHistoryOrder,createNewHistoryOrder,updateSingleHistoryOrder,deleteSingleHistoryOrder}