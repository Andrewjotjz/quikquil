//import modules
const express = require('express');
const {getAllHistoryOrders,getSingleHistoryOrder,createNewHistoryOrder,updateSingleHistoryOrder,deleteSingleHistoryOrder} = require('../controllers/order_historyController');

//create router (mini express app)
const router = express.Router();

//GET - Get all products
router.get('/', getAllHistoryOrders)

//POST - Create a new product
router.post('/create', createNewHistoryOrder)

//GET - Get a single product
router.get('/:id', getSingleHistoryOrder)

//PATCH - Update a single product
router.patch('/:id', updateSingleHistoryOrder)

//DELETE - Delete a single product
router.delete('/:id', deleteSingleHistoryOrder)


//export router module
module.exports = router;