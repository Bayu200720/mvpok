import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const CSSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "Please tell username"],
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
        nama_asli: {
            type: String,
            required: [true, "Please input your name"],
        },
        cs_name:{
            type: String,
            required: [true, "Please input your cs name"],
        },
        foto_asli:{
            type: String,
        },
        foto_avatar:{
            type: String,
        },
        id_role:{
            type: Number,
            default: 1,
        },
        id_status:{
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

//midleware buat hashing password
CSSchema.pre("save", async function(next) {
    const cs = this;
    // console.log(cust);
    if (cs.isModified("password")) {
        cs.password = await bcrypt.hash(cs.password, 8);
    }
    next();
});

const CS = mongoose.model('cs', CSSchema);

export default CS;