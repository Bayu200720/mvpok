import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const customerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "Please tell your name"],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: [true, "Please input your email"],
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw Error("Please provide a valid email address");
                }
            },
        },
        id_role: {
            type: Number,
            default: 2,
        },
        password: {
            type: String,
            required: [true, "Please input your password"],
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
            required: [true, "Please input full name"],
        },
        no_rekening:{
            type: Number,
            required: [true, "Please input rekening number"],
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
    }, 
    { 
        timestamps: true, 
    }
);

//midleware buat hashing password
customerSchema.pre("save", async function(next) {
    const customer = this;
    // console.log(cust);
    if (customer.isModified("password")) {
        customer.password = await bcrypt.hash(customer.password, 8);
    }
    // if (customer.passwordConfirm) {
    //     customer.passwordConfirm = await bcrypt.hash(customer.passwordConfirm, 8);
    // }
    // this.passwordConfirm = undefined;
    next();
});

const Customer = mongoose.model('customer', customerSchema);

export default Customer;