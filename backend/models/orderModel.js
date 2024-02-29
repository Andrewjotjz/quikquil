//import modules
const mongoose = require('mongoose');

//create Schema
const Schema = mongoose.Schema;

//create order Schema
const orderSchema = new Schema({
    Order_No: {
        type: Number,
        unique: true
    },
    Project_ID: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
        // type: Schema.Types.Mixed ---- m.mixed = { type: { level: 1 } };
    },
    Order_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    Delivery_datetime: {
        type: Date,
        required: true
    },
    Products: [
        {
            Product_Code: {
                type: String,
                required: true
            },
            Product_Name: {
                type: String,
                required: true
            },
            Supplier_Name: {
                type: String,
                required: true
            },
            Qty_per_UOM: {
                type: Number,
                required: true,
                min: 0,
                max: 100000
            },
            Product_UOM: {
                type: String
            }
        }
    ],
    Order_status: {
        type: String
    }
}, {timestamps: true})

//create "orders" COLLECTION using mongoose's model method. Export the model directly.
module.exports = mongoose.model('Orders', orderSchema)