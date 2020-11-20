import Customer from '../models/customer.js'
import express from 'express'
import bcrypt from 'bcrypt';
import Conf from '../config/config.js'
import Auth from '../middleware/auth.js'



import jwt from 'jsonwebtoken';

var customerRouter = express.Router();

// Create User
customerRouter.post("/register", async(req, res) => {
    try {
        const cust = new Customer(req.body);
        await cust.save();
        res.status(200).send({ cust });
    } catch (err) {
        res.status(400).send(err);
    }
});

//login
customerRouter.post('/login', async (req, res) => {
    try{
        const{
            username,
            password
        } = req.body;
        
        const currentUser = await new Promise((resolve, reject) =>{
            Customer.find({"username": username}, function(err, cust){
                if(err)
                    reject(err)
                resolve(cust)
            })
        })
        
        //cek apakah ada user?
        if(currentUser[0]){
            //check password
            bcrypt.compare(password, currentUser[0].password).then(function(result) {
                if(result){
                    const cust = currentUser[0];  
                    // console.log(cust);
                    const id = cust._id;
                    //urus token disini
                    var token = jwt.sign({ id }, Conf.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    cust.token=token;
                    res.status(200).send({ auth: true, token: token, "status":"logged in!"});
                } else {
                    res.status(201).json({"status":"wrong password."});
                }
            });
        } else {
            res.status(201).json({"status":"username not found"});
        }
    } catch(error){
        res.status(500).json({ error: error})
    }
})

//READ all cust
customerRouter.get('/customers', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const cust = await Customer.findById(decoded.id);
        if( cust.role === 0){
            const cust =  await Customer.find({});
        if(cust && cust.length !== 0) {
            res.json(cust)
        } else {
            res.status(404).json({
                message: 'Cust not found'
            });
        }        
        } else {
            res.status(500).send(`${cust.username} Has no Authority`);
        }
    })
});

//logout user
customerRouter.get('/logout',Auth,function(req,res){
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    });

});

//DELETE all data customers
customerRouter.delete('/customer', async (req, res) => {
    const cust = await Customer.deleteMany();

    if (cust) {
        res.json({
        message: 'all custs removed'
        })
    } else {
        res.status(404).json({
        message: 'cust not found'
        })
    }
})

export default customerRouter;