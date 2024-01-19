//import modules
const express = require('express');
const { getAllOrders, getSingleOrder, createNewOrder, 
    updateSingleOrder, deleteSingleOrder } = require('../controllers/orderController');

//create router (mini express app)
const router = express.Router();

//GET - Get all products
router.get('/', getAllOrders)

//POST - Create a new product
router.post('/create', createNewOrder)

//GET - Get a single product
router.get('/:id', getSingleOrder)

//PATCH - Update a single product
router.patch('/:id', updateSingleOrder)

//DELETE - Delete a single product
router.delete('/:id', deleteSingleOrder)


//export router module
module.exports = router;