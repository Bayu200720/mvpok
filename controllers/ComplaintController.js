import Complaint from '../models/Complaint.js';
import CS from '../models/cs.js';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';
import Customer from '../models/customer.js';
import SPV from '../models/SPV.js';

var complaintRouter = express.Router();

complaintRouter.use(bodyParser.urlencoded({ extended: false }));
complaintRouter.use(bodyParser.json());

//CREATE complaint role customer
complaintRouter.post('/create', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
     
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const customer = await Customer.findById(decoded.id);
        if(customer && customer.length !== 0){
            try {
                const { judul, detail_komplain, gambar } = req.body;
                const complaint = new Complaint({
                    judul: judul,
                    detail_komplain: detail_komplain,
                    gambar: gambar,
                    id_customer: customer._id
                });
                await complaint.save();
                res.status(201).send({ complaint });
            } catch (err) {
                res.status(400).send(err);
            }  
        } else {
                res.status(500).send(` Tidak Memiliki Wewenang`);
        }
    })
});

//GET all complaint role SPV
complaintRouter.get('/get-all-complaint', async (req,res) => {
    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const spv = await SPV.findById(decoded.id);
            if(spv && spv.length !== 0){
                const complaint =  await Complaint.find({});
                if(complaint && complaint.length !== 0) {
                    res.json(complaint)
                } else {
                    res.status(404).json({
                       message: 'Complaint not found'
                    });
                }        
            } else {
                //console.log('error');
                res.status(500).send(`Tidak Memiliki Wewenang`);
            }
        })

  
});

//Get complaint by id customer role customer
complaintRouter.get('/get-complaint-by-customer', async (req,res) => {
    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const customer = await Customer.findById(decoded.id);
        if(customer && customer.length !== 0){
            const complaint =  await Complaint.find({"id_customer":customer._id});
            if(complaint && complaint.length !== 0) {
                res.json(complaint)
            } else {
                res.status(404).json({
                    message: 'Complaint not found'
                });
            }        
        } else {
                
                res.status(500).send(`Tidak Memiliki Wewenang`);
        }
    })


});


//Get complaint status 0 role CS
complaintRouter.get('/submitted', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const cs = await CS.findById(decoded.id);
        if(cs && cs.length !== 0){
            const complaint =  await Complaint.find({"id_tag":"0"});
            if(complaint && complaint.length !== 0) {
                res.json(complaint)
            } else {
                res.status(404).json({
                    message: 'Complaint not found'
                });
            }
        } else {
            
            res.status(500).send(` Tidak Memiliki Wewenang`);
        }
    })
});


//GET complaint assign-me role CS
complaintRouter.get('/assign-me', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const cs = await CS.findById(decoded.id);
        if(cs && cs.length !== 0){
            const complaint =  await Complaint.find({"id_cs": cs._id});
            if(complaint && complaint.length !== 0) {
                res.json(complaint)
            } else {
                res.status(404).json({
                    message: 'Complaint not found'
                });
            }
        } else {
            res.status(500).send(` Tidak Memiliki Wewenang`);
        }
    })
});


//codingan dari bayu

//selesaikan complaint role CS
complaintRouter.put('/baca/:id', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const user = await Cs.findById(decoded.id);
        
            if(user.id_role == 1){
               
                    const complaint = await Complaint.findById(req.params.id);
                
                    if (complaint) {
                        complaint.id_tag = 1;
                        complaint.id_cs = user._id;
                        complaint.id_kategori=1;
                        const updateDataComplaint = await complaint.save()
                        res.send(updateDataComplaint);
                    } else {
                        res.status(404).json({
                            message: 'Complaint not found'
                        })
                    }
            } else {
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
    })

//Memberi rating ke CS role custamer
complaintRouter.put('/rating/:id', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const user1 = await Customer.findById(decoded.id);
       
            if(user1.id_role == 2){
               const complaint = await Complaint.findById(req.params.id);
               console.log(complaint)
                if(complaint.id_tag == 5){
                    const {rating} = req.body;
                
                    if (complaint) {
                        complaint.rating = rating;
                        complaint.id_customer = user1._id;
                        const updateDataComplaint = await complaint.save()
                        res.send(updateDataComplaint);
                    } else {
                        res.status(404).json({
                            message: 'Complaint not found'
                        })
                    }
                }else{
                    res.status(201).send(`Complaint belom selesai`);
                }
            } else {
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
    })


//CREATE respon kompline role CS
complaintRouter.post('/TLCS/:id_komplain', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const user = await Cs.findById(decoded.id);
        
            if(user.id_role === 1){
                const id=user._id
               console.log(id)
               try {
                   const {detail_respon} = req.body;
           
                   const complaint = new Complaint({
                       id_komplain: req.params.id_komplain,
                       detail_respon:detail_respon,
                       id_cs:id,
                       id_customer:"",
                       rating:"",
                   });
           
                   const createComplaint = await complaint.save();
           
                   res.status(201).json(createComplaint);
               } catch (err) {
                   console.log(err)
                   res.status(500).json({ error: 'Respon creation failed'});
               }   
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })


   
});


//read Rating CS role SPV
complaintRouter.get('/getRatingCS', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          const user = await SPV.findById(decoded.id);
             if( user.id_role === 0){
                const complaint =  await Complaint.find({});

                if(complaint && complaint.length !== 0) {
                    res.json(complaint)
                } else {
                    res.status(404).json({
                        message: 'Complaint not found'
                    });
                }
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
});


//read Rating by id CS role CS
complaintRouter.get('/getRatingById', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          const user = await Cs.findById(decoded.id);
             if( user.id_role === 1){
                const complaint =  await Complaint.find({"id_cs":user._id});

                if(complaint && complaint.length !== 0) {
                    res.json(complaint)
                } else {
                    res.status(404).json({
                        message: 'Complaint not found'
                    });
                }
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
});


export default complaintRouter;