import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const customerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "Please tell your name!"],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: [true, "Please input your password"],
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw Error("Please provide a valid email address!");
                }
            },
        },
        role: {
            type: Number,
            default: 0,
        },
        password: {
            type: String,
            required: [true, "Please input password"],
            minlength: 6, // min 6 char
            trim: true, // auto hapus spasi kiri dan kanan
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                    // biar gak asal input password jadi password
                    throw Error("Your password is invalid!");
                }
            },
        },
        nama_lengkap:{
            type: String,
            required: [true, "Please input nama lengkap"],
        },
        no_rekening:{
            type: Number,
            required: [true, "Please input no_rekening"],
            minlength: 15, // min 7 char
            maxlength: 15,
            unique: true,
            trim: true, // auto hapus spasi kiri dan kanan
        },
        NIK:{
            type:Number,
            required: [true, "Please input NIK"],
            minlength: 16, // min 7 char
            maxlength: 16,
            unique: true,
            trim: true, // auto hapus spasi kiri dan kanan
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        token:{
            type: String
        }
    }, { timestamps: true }
);

//LOGIC CEK LOGIN
customerSchema.statics.findByCredentials = async(username, password) => {
    const cust = await Cust.findOne({ username });

    if (!cust) {
        throw "Unable to login"; // user belum terdaftar
    }

    const isMatch = await bcrypt.compare(password, cust.password);

    if (!isMatch) {
        throw "Unable to login"; // password nya salah
    }

    return cust;
};

// customerSchema.methods.generateAuthToken = async function() {
//     const cust = this;
//     const token = jwt.sign({ _id: cust._id.toString() }, "DTS05UYE", {
//         expiresIn: "7 days", // kalau mau ganti pake grammer english
//     });

//     cust.tokens = cust.tokens.concat({ token });
//     await cust.save();
//     return token;
// };

customerSchema.methods.generateToken=function(cb){
    var user =this;
    var token=jwt.sign(user._id.toHexString(),confiq.SECRET);

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

//delete token
customerSchema.methods.deleteToken=function(token,cb){
    var user=this;

    user.update({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

//midleware buat hashing password
// customerSchema.pre("save", async function(next) {
//     const cust = this;
//     // console.log(cust);
//     if (cust.isModified("password")) {
//         cust.password = await bcrypt.hash(cust.password, 8);
//     }
//     if (cust.passwordConfirm) {
//         cust.passwordConfirm = await bcrypt.hash(cust.passwordConfirm, 8);
//     }
//     // this.passwordConfirm = undefined;
//     next();
// });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;