const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const express = require('express');
const seedData = require('./utils/seeder.js');
const productRoutes = require('./routes/productRoutes.js');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());




mongoose.connect(process.env.DATABASE_STRING).then(()=> {
    console.log('datbase connected successfully');
}).catch((err) => {
    console.log(err);
})

const port = process.env.PORT;
app.use('/api/v1/products',productRoutes);

app.listen(port,() => {
    console.log(`server is running on port ${port}....`);
})