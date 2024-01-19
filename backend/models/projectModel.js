//import modules
const mongoose = require('mongoose')

//create schema
const Schema = mongoose.Schema;

//create project schema
const projectSchema = new Schema({
    Project_ID: {
        type: String,
        required: true,
        unique: true
    },
    Project_Name: {
        type: String,
        required: true
    },
    P_Address_Street: {
        type: String,
        required: true
    },
    P_Address_Suburb: {
        type: String,
        required: true
    },
    P_Address_Postcode: {
        type: Number,
        required: true
    },
    P_Address_State: {
        type: String,
        required: true
    },
    P_Contacts: [{
        P_Contact_Name: {
            type: String
        },
        P_Contact_Mobile: {
            type: Number
        },
        P_Contact_Role: {
            type: String
        }
    }]
}, { timestamps: true })

//create "products" COLLECTION using mongoose's model method. Export the model directly.
module.exports = mongoose.model('Projects', projectSchema)