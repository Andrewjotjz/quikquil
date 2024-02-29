//import modules
const mongoose = require('mongoose');

//create Schema
const Schema = mongoose.Schema;

//create order_history Schema
const order_historySchema = new Schema({
    
    Order_No: {
        type: Number
    },
    Project_ID: {
        type: String
    },
    Location: {
        type: String
    },
    Order_date: {
        type: Date
    },
    Delivery_datetime: {
        type: Date
    },
    Products: [
        {
            _id: {
                type: String
            },
            Product_Code: {
                type: String
            },
            Product_Name: {
                type: String
            },
            Supplier_Name: {
                type: String
            },
            Qty_per_UOM: {
                type: Number,
                min: 0,
                max: 100000
            },
            Product_UOM: {
                type: String
            }
        }
    ],
    Order_update_reason: {
        type: String        
    },
    Order_update_comment: {
        type: String
    }
}, {timestamps: true})

//create "history_orders" COLLECTION using mongoose's model method. Export the model directly.
module.exports = mongoose.model('HistoryOrders', order_historySchema)