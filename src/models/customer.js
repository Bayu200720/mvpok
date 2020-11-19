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
            minlength: 7, // min 7 char
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
            trim: true, // auto hapus spasi kiri dan kanan
        },
        NIK:{
            type:Number,
            required: [true, "Please input NIK"],
            minlength: 16, // min 7 char
            maxlength: 16,
            trim: true, // auto hapus spasi kiri dan kanan
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

customerSchema.methods.generateAuthToken = async function() {
    const cust = this;
    const token = jwt.sign({ _id: cust._id.toString() }, "DTS05UYE", {
        expiresIn: "7 days", // kalau mau ganti pake grammer english
    });

    cust.tokens = cust.tokens.concat({ token });
    await cust.save();
    return token;
};

//midleware buat hashing password
customerSchema.pre("save", async function(next) {
    const cust = this;
    // console.log(cust);
    if (cust.isModified("password")) {
        cust.password = await bcrypt.hash(cust.password, 8);
    }
    if (cust.passwordConfirm) {
        cust.passwordConfirm = await bcrypt.hash(cust.passwordConfirm, 8);
    }
    // this.passwordConfirm = undefined;
    next();
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;