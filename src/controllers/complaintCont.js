import Complaint from '../models/complaint.js'
import Customer from '../models/customer.js'
import Conf from '../config/config.js'
import express from 'express'
import multer from 'multer'
import path from 'path'
import jwt from 'jsonwebtoken';


const __dirname = path.resolve()

var complaintRouter = express.Router();

// file location and name
const storage = multer.diskStorage({
    destination(req, file, cb) {
    cb(null, __dirname + '/src/images/complaints')
    },
    filename(req, file, cb) {
    cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
    },
})

// filter file
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
    return cb(null, true)
    } else {
    cb('Images only!')
    }
}

// upload
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
    },
})

// upload gambar
complaintRouter.post('/upload-gambar', upload.single('image'), (req, res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const cust = await Customer.findById(decoded.id);
        // console.log(role)
        if(cust.role === 0){
            try {
                console.log(req.file);
                if (!req.file) {
                    res.status(500);
                    return next(Error);
                }
                // res.send(`/${req.file.path}`)
                res.send({message:`success`})
            
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: 'Complaint creation failed'});
            }   
            } else {
                res.status(500).send(`${cust.username} Has no Authority`);
            }
    })
});


// create komplain
complaintRouter.post('/create', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const cust = await Customer.findById(decoded.id);
        // console.log(role)
        if( cust.role == 0){
            try {
                const {judul,detail_komplain, id_kategori, id_cs, id_tag} = req.body;
                const doc = new Complaint({
                    judul,
                    detail_komplain,
                    id_kategori,
                    id_cs,
                    id_customer : `${cust._id}`,
                    id_tag
                });
                const createDoc = await doc.save();
                res.status(201).json(createDoc);
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: 'Complaint creation failed'});
            }   
            } else {
                res.status(500).send(`${cust.username} Has no Authority`);
            }
    })
});

// get all complaints
complaintRouter.get('/complaints', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const cust = await Customer.findById(decoded.id);
        if( cust.role == 0){
            const cust =  await Customer.find({});
        if(cust && cust.length !== 0) {
            res.json(cust)
        } else {
            res.status(404).json({
                message: 'Complaint not found'
            });
        }        
        } else {
            res.status(500).send(`${cust.username} Has no Authority`);
        }
    })
});


complaintRouter.get('/check', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['authorization'];
    // console.log(token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
    });
});

export default complaintRouter;