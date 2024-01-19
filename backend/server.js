//import modules
require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const projectRoutes = require('./routes/projectRoutes');

//create express app
const app = express();

//middleware - logs request path and request method
app.use((req,res,next) => {
    console.log(req.path, req.method);
    next();
})

//middleware - passes any request with json body to 'req' object
app.use(express.json());

//route handler
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/projects', projectRoutes);

//connect to MongoDB
mongoose.connect(process.env.MONG_URI)
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`Connected to DB. Listening to port ${process.env.PORT}`)
            });
        })
        .catch((error) => {
            console.log(error)
        })
