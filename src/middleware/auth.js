import Customer from '../models/customer.js'

let Auth =(req,res,next)=>{
    let token =req.cookies.auth;
    Customer.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true
        });

        req.token= token;
        req.user=user;
        next();

    })
}

export default Auth;
