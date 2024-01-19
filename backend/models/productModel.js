//import modules
const mongoose = require('mongoose');

//create Schema
const Schema = mongoose.Schema;

//create product schema
const productSchema = new Schema({
    Product_Code: {
        type: String,
        required: true,
        unique: true
    },
    Product_Name: {
        type: String,
        required: true
    },
    Supplier_Name: {
        type: String,
        required: true
    },
    Product_UOM: {
        type: String,
        required: true
    },
    Rate_Ex_GST: {
        // type: Schema.Types.Decimal128,
        type: Number,
        min: 0,
        required: true
    },
    Installation_Category: {
        type: String,
        required: true
    }
}, { timestamps: true })


//create "products" COLLECTION using mongoose's model method. Export the model directly.
module.exports = mongoose.model('Products', productSchema)