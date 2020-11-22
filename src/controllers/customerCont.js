import express from 'express'
import bcrypt from 'bcrypt'
import Conf from '../config/config.js'
import { v4 as uuidv4 } from 'uuid'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken';
import Customer from '../models/customer.js'

var customerRouter = express.Router();

customerRouter.use(bodyParser.urlencoded({ extended: false }));
customerRouter.use(bodyParser.json());

// ADD User
customerRouter.post('/registration', async (req, res) => {
    try {
        const{username, nama_lengkap, NIK, norek, email, password, isVerified} = req.body;

        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);
        const VerificationToken = uuidv4(email);

        const usernameDuplicate = await Customer.find({ "username" : username  }).count()
        const emailDuplicate = await Customer.find({ "email" : email }).count()
        const NIKDuplicate = await Customer.find({ "NIK" : NIK }).count()

        if(usernameDuplicate + emailDuplicate + NIKDuplicate > 0){
            res.status(202).json({ message: 'Username / Email / NIK Already Registered' });
        } else {
            Customer.create({
                username : username,
                nama_lengkap : nama_lengkap,
                NIK : NIK,
                norek : norek,
                email : email,
                password : hashedPw,
                isVerified : isVerified,
                VerificationToken : VerificationToken,
            }, 
            async function (err) {
                try {
                    if (err) {
                        res.status(500).send({ message: 'Gagal Melakukan Registrasi Akun!' });
                    } else {
                        let transporter = nodemailer.createTransport({
                            service: "gmail",
                            host: "smtp.gmail.com",
                            port: 465,
                            secure: true,
                            auth: {
                            user: process.env.MAIL,
                            pass: process.env.PASS,
                            },
                        });
                        
                          // send mail with defined transport object
                        let info = await transporter.sendMail({
                            from: '"Bank BRI" <ugm.backend.05@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Verifikasi Akun | Bank BRI", // Subject line
                            text: "Silahkan melakukan verifikasi akun dengan klik link berikut ", // plain text body
                            html: '<p>Silahkan verifikasi akun dengan klik link berikut. <a href=" http://cf82d7e6deb2.ngrok.io/cust/verification/'+VerificationToken+'">Verifikasi</a></p>', // html body
                        });
                        
                        console.log("Message sent: %s", info.messageId); // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        res.status(201).json({ message: 'Berhasil Mendaftar. Silahkan Cek Email untuk Verifikasi Akun.' });
                    }
                } catch (error) {
                    res.status(500).json(error);
                }
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Verification Email Address
customerRouter.get('/verification/:token', async (req, res) => {
    try {
        const isVerified = true;
        const VerificationToken = req.params.token;

        const ListUser = await Customer.findOne({ "VerificationToken": VerificationToken });

        if(ListUser){
            ListUser.isVerified = isVerified;

            await ListUser.save();
            res.status(200).json({  message: 'Akun Berhasil Diverifikasi!' });
        } else {
            res.status(404).json({ message: 'Akun Tidak Ditemukan!' });
        }
    } catch (error) {
        console.log(error)
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
                    // Make sure the user has been verified
                    if (!currentUser[0].isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });
                    // console.log(cust);
                    const id = cust._id;
                    //urus token disini
                    var token = jwt.sign({ id }, Conf.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    cust.token=token;
                    res.status(200).send({ auth: true, token: token, "status":"logged in!"});
                } else {
                    res.status(202).json({"status":"wrong password."});
                }
            });
        } else {
            res.status(202).json({"status":"username not found"});
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
// customerRouter.get('/logout',Auth,function(req,res){
//     req.user.deleteToken(req.token,(err,user)=>{
//         if(err) return res.status(400).send(err);
//         res.sendStatus(200);
//     });

// });

//testing
//DELETE all data customers
customerRouter.delete('/customer', async (req, res) => {
    const cust = await Customer.deleteMany();

    if (cust) {
        res.json({
        message: 'all customers removed'
        })
    } else {
        res.status(404).json({
        message: 'customer not found'
        })
    }
})

customerRouter.post("/confirmation/:email/:token", async (req, res, next) => {

    // Find a matching token
    Secretcode.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        Customer.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
});


customerRouter.post("/resend", async (req, res, next) => {

    Customer.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Secretcode({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASS,
                }
            });

            var mailOptions = { from: process.env.MAIL, to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/cust/confirmation\/' + user.email + '\/' + token.token };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });

    });
});
export default customerRouter;