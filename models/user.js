import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,            
        },
        email: {
            type: String,
     
        },
        kategori_user:{
            type: Number,
            required:true,
        },
        nama_asli:{
            type: String,
        },
        fp_asli:{
            type: String,
        },
        fp_palsu:{
            type: String,
        },
        status_user:{
            type: Number,
        },
        NIK:{
            type:Number,
        },
        No_req:{
            type:Number,
            maxlength: 15,
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', UserSchema);

export default User;