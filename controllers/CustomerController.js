import Customer from '../models/customer.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';

const customerRouter = express.Router();

customerRouter.use(bodyParser.urlencoded({ extended: false }));
customerRouter.use(bodyParser.json());

//Create user customer (role customer)
//@route POST /customer/register
customerRouter.post('/register', async (req, res) => {
 
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(200).send({ customer });
    } catch (err) {
        res.status(400).send(err);
    }
})

//Get all user customer
//@route GET /customer/get-customer
customerRouter.get('/get-customer', async (req,res) => {

    const user =  await Customer.find({});

    if(user && user.length !== 0) {
        res.json(user)
    } else {
        res.status(404).json({
            message: 'User not found'
        });
    }
    
});


//Login customer (role customer)
//@route POST /customer/login
customerRouter.post('/login', async (req, res) => {
    try{
        const{
            username,
            password
        } = req.body;
        
        const currentCustomer = await new Promise((resolve, reject) =>{
            Customer.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
        console.log(currentCustomer[0]);
        if(currentCustomer[0]){
            if(currentCustomer[0].id_role === 2){
                //check password
                bcrypt.compare(password, currentCustomer[0].password).then(function(result) {
                    
                    if(result){
                        const user = currentCustomer[0];  
                        const id = user._id
                        //console.log(id);
                        //urus token disini
                        var token = jwt.sign({ id }, Conf.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token })
                    } else {
                        res.status(201).json({"status":"wrong password."});
                    }
                });
            }else{
                res.status(201).json({"status":"Username not Active"});
            }
        } else {
            res.status(201).json({"status":"Username not found"});
        }
    } catch(error){
        res.status(500).json({ error: error})
    }
})

export default customerRouter;