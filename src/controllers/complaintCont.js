import Complaint from '../models/complaint.js'
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
    console.log(req.file);
    if (!req.file) {
        res.status(500);
        return next(Error);
    }
    // res.send(`/${req.file.path}`)
    res.send({message:`success`})
})

// create komplain
complaintRouter.post('/create', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['Authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const role = decoded.cust.role;
        console.log(role)
        if(role === 0){
            try {
                const {judul,detail_komplain, id_kategori, id_cs, id_customer, id_tag} = req.body;

                const doc = new Complaint({
                    judul,
                    detail_komplain,
                    id_kategori,
                    id_cs,
                    id_customer,
                    id_tag
                });
        
                const createDoc = await doc.save();
        
                res.status(201).json(createDoc);
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: 'Doc creation failed'});
            }   
            } else {
                res.status(500).send(`${decoded.cust.username} Tidak Memiliki Wewenang`);
            }
    })
});

export default complaintRouter;