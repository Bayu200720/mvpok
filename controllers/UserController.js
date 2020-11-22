// import User from '../models/user.js';
// import Komplain from './../models/komplain.js';
// import express from 'express';
// import bcrypt from 'bcrypt';
// import bodyParser from 'body-parser';
// import jwt from 'jsonwebtoken';
// import Conf from '../config.js';

// var userRouter = express.Router();
// var router = express.Router();

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());

// //CREATE user customoer role customer
// userRouter.post('/registerCustamer', async (req, res) => {
 
//                     var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            
//                     User.create({
//                         username : req.body.username,
//                         password : hashedPassword,
//                         email : req.body.email,
//                         kategori_user : 2
//                     },
//                         function (err, user) {
//                         if (err) return res.status(500).send("There was a problem registering the user.")
//                         res.status(200).send(`Berhasil Daftar`);
//                         }); 
// })



// //login role all
// userRouter.post('/login', async (req, res) => {
//     try{
//         const{
//             username,
//             password
//         } = req.body;
        
//         const currentUser = await new Promise((resolve, reject) =>{
//             User.find({"username": username}, function(err, user){
//                 if(err)
//                     reject(err)
//                 resolve(user)
//             })
//         })
        
//         //cek apakah ada user?
    
//         if(currentUser[0]){

//             if(currentUser[0].status_user !== 0){
//                 //check password
//                 bcrypt.compare(password, currentUser[0].password).then(function(result) {
                    
//                     if(result){
//                         const user = currentUser[0];  
//                         const id = user._id
//                         console.log(id);
//                         //urus token disini
//                         var token = jwt.sign({ id }, Conf.secret, {
//                             expiresIn: 86400 // expires in 24 hours
//                         });
//                         res.status(200).send({ auth: true, token: token });
//                         res.status(201).json({"status":"logged in!"});
//                     } else {
//                         res.status(201).json({"status":"wrong password."});
//                     }
//                 });
//             }else{
//                 res.status(201).json({"status":"username not Active"});
//             }
//         } else {
//             res.status(201).json({"status":"username not found"});
//         }
//     } catch(error){
//         res.status(500).json({ error: error})
//     }
// })


// //isi data diri customer role customer
// userRouter.put('/datauser', async (req,res) => {

//     //header apabila akan melakukan akses
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
//     //verifikasi jwt
//     jwt.verify(token, Conf.secret, async function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//         const user = await User.findById(decoded.id);
        
//             if(user.kategori_user == 2){
//                 const {nama, NIK, No_req} = req.body;
    
//                 const user = await User.findById(user._id);
            
//                 if (user) {
//                     user.nama_asli = nama;
//                     user.NIK = NIK;
//                     user.No_req = No_req;
            
//                     const updateDatauser = await user.save()
            
//                     res.send(updateDatauser);
//                 } else {
//                     res.status(404).json({
//                         message: 'User not found'
//                     })
//                 }
//             } else {
//                 res.status(500).send(` Tidak Memiliki Wewenang`);
//             }
//         })
//     })


// //CREATE user CS role SPV
// userRouter.post('/registerCS', async (req, res) => {
 
//     //header apabila akan melakukan akses
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
//     //verifikasi jwt
//     jwt.verify(token, Conf.secret, async function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//         const user = await User.findById(decoded.id);
        
//          if(user.kategori_user == 0){

//             var hashedPassword = bcrypt.hashSync(req.body.password, 8);

//             const DataCS = User.create({
//                 nama_asli: req.body.nama_asli,
//                 username : req.body.nama_palsu,
//                 password : hashedPassword,
//                 fp_asli : req.body.fp_asli,
//                 fp_palsu : req.body.fp_palsu,
//                 status_user :1 ,
//                 kategori_user:1,
                
//             },
//                 function (err, user) {
//                 if (err) return res.status(500).send("There was a problem registering the user.")
//                 res.status(200).send(`Berhasil Daftar ${DataCS}`);
//                 }); 

//         } else {
//             res.status(500).send(`Tidak Memiliki Wewenang`);
//         }
//     })
// })



// //menampilkan data CS role SPV
// userRouter.get('/getDataCS/', async (req,res) => {

//     //header apabila akan melakukan akses
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
//     //verifikasi jwt
//     jwt.verify(token, Conf.secret, async function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//           const user = await User.findById(decoded.id);
//              if( user.kategori_user === 0){
//                 const user =  await User.find({"kategori_user":1});

//                 if(user && user.length !== 0) {
//                     res.json(user)
//                 } else {
//                     res.status(404).json({
//                         message: 'User not found'
//                     });
//                 }
//              } else {    
//                 res.status(500).send(` Tidak Memiliki Wewenang`);
//              }
//         })  
// });





// // //READ all data users
// // userRouter.get('/datauser', async (req,res) => {
// //     //header apabila akan melakukan akses
// //     var token = req.headers['x-access-token'];
// //     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

// //     //verifikasi jwt
// //     jwt.verify(token, Conf.secret, async function(err, decoded) {
// //     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
// //     const jabatan = decoded.user.jabatan;
// //     console.log(jabatan)
// //         if(jabatan == 1){
// //             const user =  await User.find({});
// //             if(user && user.length !== 0) {
// //                 res.json(user)
// //             } else {
// //                 res.status(404).json({
// //                     message: 'Users not found'
// //                 });
// //             }
// //         } else {
// //             res.status(500).send(` Tidak Memiliki Wewenang`);
// //         }
// //     })
// // });

// // //READ user by ID
// // userRouter.get('/datauser/:id', async (req,res) => {

// // //header apabila akan melakukan akses
// // var token = req.headers['x-access-token'];
// // if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

// // //verifikasi jwt
// // jwt.verify(token, Conf.secret, async function(err, decoded) {
// //     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
// //     const jabatan = decoded.user.jabatan;
// //     console.log(jabatan)
// //         if(jabatan == 1){
// //             const user = await User.findById(req.params.id);

// //             if(user) {
// //                 res.json(user)
// //             } else {
// //                 res.status(404).json({
// //                     message: 'User not found'
// //                 });
// //             }
// //         } else {
// //             res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
// //         }
// //     })
// // });

// //UPDATE status Disable user role SPV
// userRouter.put('/disable/:id', async (req,res) => {

// //header apabila akan melakukan akses
// var token = req.headers['x-access-token'];
// if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

// //verifikasi jwt
// jwt.verify(token, Conf.secret, async function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//     const user = await User.findById(decoded.id);
        
//          if(user.kategori_user == 0){
//             const {status_user} = req.body;

//             const user = await User.findById(req.params.id);
        
//             if (user) {
        
                
//                 user.status_user = 0;
        
//                 const updateDatauser = await user.save()
        
//                 res.send(updateDatauser);
//             } else {
//                 res.status(404).json({
//                     message: 'User not found'
//                 })
//             }
//         } else {
//             res.status(500).send(` Tidak Memiliki Wewenang`);
//         }
//     })
// })

// //UPDATE status Enable user role SPV
// userRouter.put('/enable/:id', async (req,res) => {

//     //header apabila akan melakukan akses
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
//     //verifikasi jwt
//     jwt.verify(token, Conf.secret, async function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//         const user = await User.findById(decoded.id);
            
//              if(user.kategori_user == 0){
//                 const {status_user} = req.body;
    
//                 const user = await User.findById(req.params.id);
            
//                 if (user) {
            
                    
//                     user.status_user = 1;
            
//                     const updateDatauser = await user.save()
            
//                     res.send(updateDatauser);
//                 } else {
//                     res.status(404).json({
//                         message: 'User not found'
//                     })
//                 }
//             } else {
//                 res.status(500).send(` Tidak Memiliki Wewenang`);
//             }
//         })
//     })

// //DELETE user by ID
// userRouter.delete('/datauser/:id', async (req,res) => {
//     //header apabila akan melakukan akses
// var token = req.headers['x-access-token'];
// if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

// //verifikasi jwt
// jwt.verify(token, Conf.secret, async function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//     const jabatan = decoded.user.jabatan;
//     console.log(jabatan)
//         if(jabatan == 1){
//             const user = await User.findById(req.params.id);

//             if (user) {
//                 await user.remove();
//                 res.json({
//                     message: 'Data removed'
//                 })
//             } else {
//                 res.status(404).json({
//                     message: 'User not found' 
//                 })       
//             }
//         } else {
//             res.status(500).send(`${decoded.user.username} Tidak Memiliki Wewenang`);
//         }
//     })


// })


// export default userRouter;