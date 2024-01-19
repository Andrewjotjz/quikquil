//import modules
const express = require('express');
const { getAllProducts, getSingleProduct, createNewProduct, 
    updateSingleProduct, deleteSingleProduct } = require('../controllers/productController');

//create router (mini express app)
const router = express.Router();

//GET - Get all products
router.get('/', getAllProducts)

//POST - Create a new product
router.post('/create', createNewProduct)

//GET - Get a single product
router.get('/:id', getSingleProduct)

//PATCH - Update a single product
router.patch('/:id', updateSingleProduct)

//DELETE - Delete a single product
router.delete('/:id', deleteSingleProduct)


//export router module
module.exports = router;