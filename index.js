const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const globalErrorHandler = require('./controllers/errorController.js');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError.js');
const seedData = require('./utils/seeder.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoute.js');
const cartRoutes = require('./routes/cartRoute.js');
const orderRoutes = require('./routes/orderRoute.js');
const mongosanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const app = express();


app.set('query parser','extended');
app.use(express.json({limit: '10kb'}));
//data sanitization against no sql query injection
app.use(mongosanitize( {replaceWith: '_'}));
//preventing cross site scripting
app.use(xss());

app.use(helmet());
app.use(morgan('dev'));


const limit = rateLimit(
    {
        windowMs: 15 * 60 * 1000,
	    limit: 100,
        message: 'plase try again after 15 minutes'
    }
)

app.use('/api',limit);

mongoose.connect(process.env.DATABASE_STRING).then(()=> {
    console.log('datbase connected successfully');
}).catch((err) => {
    console.log(err);
})

const port = process.env.PORT;
app.use('/api/v1/products',productRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/Orders',orderRoutes);
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Ecommerce Backend is running'
    });
});


app.use((req, res,next) => 
{
    next(new AppError(`can't find this ${req.originalUrl} in this server`,404));
})

app.use(globalErrorHandler);

app.listen(port,() => {
    console.log(`server is running on port ${port}....`);
})