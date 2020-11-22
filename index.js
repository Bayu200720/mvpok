import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import customerRouter from './src/controllers/customerCont.js';
import complaintRouter from './src/controllers/complaintCont.js';

const app = express()
dotenv.config()

app.get('/', (req, res, next) => {
    res.send({success: true})
})

//default error
app.use((err, req, res, next) => {
    res.send(err.message)
})

app.use('/cust', customerRouter);
app.use('/complaint', complaintRouter);


app.listen(process.env.PORT, () => {
    console.log(`App listens to port ${process.env.PORT}`);
});

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

