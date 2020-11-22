// langkah 1 - import ok
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import complaintRouter from './controllers/ComplaintController.js';
import customerRouter from './controllers/CustomerController.js';
import csRouter from './controllers/CSController.js';
import spvRouter from './controllers/SPVController.js';
import responRouter from './controllers/responController.js';

const app= express();

// Connect to DB
var uri = process.env.MONGODB_URI;
mongoose.connect(uri,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connect to DB success')
}).catch(err => {
    console.log('Connect to failed ' + err)
})

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//langkah 3 (routes)
app.get('/', (req,res) => {
    res.json({
        message: 'success',
    });
})

app.use('/complaint', complaintRouter);
app.use('/customer', customerRouter);
app.use('/cs', csRouter);
app.use('/spv', spvRouter);
app.use('/respon', responRouter);

// langkah 2
app.listen(process.env.PORT, () => {
    console.log(`App listens to port ${process.env.PORT}`);
});