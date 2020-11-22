import CS from '../models/cs.js';
import SPV from '../models/SPV.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';


const csRouter = express.Router();

csRouter.use(bodyParser.urlencoded({ extended: false }));
csRouter.use(bodyParser.json());



//CREATE user CS role SPV
csRouter.post('/register', async (req, res) => {

    try {
        const cs = new CS(req.body);
        await cs.save();
        res.status(200).send({ cs });
    } catch (err) {
        res.status(400).send(err);
    }
})


//login role CS
csRouter.post('/login', async (req, res) => {

    try{
        const{
            username,
            password
        } = req.body;
        
        const currentCS = await new Promise((resolve, reject) =>{
            CS.find({"username": username}, function(err, user){
                if(err)
                    reject(err)
                resolve(user)
            })
        })
        
        //cek apakah ada user?
        console.log(currentCS[0]);
        if(currentCS[0]){
            if(currentCS[0].id_role == 1){
                //check password
                bcrypt.compare(password, currentCS[0].password).then(function(result) {
                    
                    if(result){
                        const user = currentCS[0];  
                        const id = user._id
                        //console.log(id);
                        //urus token disini
                        var token = jwt.sign({ id }, Conf.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ auth: true, token: token });
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

//UPDATE status CS user role SPV
csRouter.put('/edit-status/:id', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const spv = await SPV.findById(decoded.id);
            
        if(spv && spv.length !== 0){
            const { id_status  } = req.body;
            const cs = await CS.findById(req.params.id);     
            if (cs) {
                cs.id_status = id_status;
                const updateDataCS = await cs.save()
                res.send(updateDataCS);
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        } else {
            res.status(500).send(` Tidak Memiliki Wewenang`);
        }
    })
})

//menampilkan all data CS role SPV
csRouter.get('/get-all-data/', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const spv = await SPV.findById(decoded.id);
            
        if(spv && spv.length !== 0){
            const cs =  await CS.find({});
            if(cs && cs.length !== 0) {
                res.json(cs)
            } else {
                res.status(404).json({
                    message: 'CS not found'
                });
            }
        } else {    
                res.status(500).send(` Tidak Memiliki Wewenang`);
        }
    })  
});

//delete cs role SPV
//DELETE /api/user/delete/:id
csRouter.delete('/delete-cs/:id', async(req, res) => {
    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const spv = await SPV.findById(decoded.id);
        if(spv && spv.length !== 0){
            const cs = await CS.findById(req.params.id);
            if(cs){
                await cs.remove();
                res.json({
                    message: 'CS removed'
                });
            } else {
                res.status(404).json({
                    message: 'CS not found'
                });
            }
        } else {    
            res.status(500).send(` Tidak Memiliki Wewenang`);
        }  
    }) 
});

export default csRouter;