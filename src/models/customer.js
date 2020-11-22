import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema(
    {
        username: {
        type: String,
        required: true,
        },
        nama_lengkap: {
        type: String,
        required: true,
        },
        NIK: {
            type: String,
            required: true,
            unique: true,
        },
        norek: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        VerificationToken: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;