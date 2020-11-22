import SPV from './../models/SPV.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';


const spvRouter = express.Router();

spvRouter.use(bodyParser.urlencoded({ extended: false }));
spvRouter.use(bodyParser.json());



//Create user spv
//@route POST /spv/register
spvRouter.post('/register', async (req, res) => {
 
    try {
        const spv = new SPV(req.body);
        await spv.save();
        res.status(200).send({ spv });
    } catch (err) {
        res.status(400).send(err);
    }
})



//Login spv
//@route POST /spv/login
spvRouter.post('/login', async (req, res) => {
    try{
        const{
            username,
            password
        } = req.body;
        
        const currentCustomer = await new Promise((resolve, reject) =>{
            SPV.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
    
        if(currentCustomer[0]){

            if(currentCustomer[0].id_role == 0){
                //check password
                bcrypt.compare(password, currentCustomer[0].password).then(function(result) {
                    
                    if(result){
                        const user = currentCustomer[0];  
                        const id = user._id
                        console.log(id);
                        //urus token disini
                        var token = jwt.sign({ id }, Conf.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
                        res.status(201).json({"status":"logged in!"});
                    } else {
                        res.status(201).json({"status":"wrong password."});
                    }
                });
            }else{
                res.status(201).json({"status":"username not Active"});
            }
        } else {
            res.status(201).json({"status":"username not found"});
        }
    } catch(error){
        res.status(500).json({ error: error})
    }
})




export default spvRouter;