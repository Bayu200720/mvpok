import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
    {
        judul: {
            type: String,
            required: [true, "Please input title"],
        },
        detail_komplain: {
            type: String,
            required: [true, "Please input detail complaint"],          
        },
        gambar: {
            type: String,        
        },
        id_kategori: {
            type: Number,   
        },
        id_cs: {
            type: String,
        },
        id_customer: {
            type: String,      
        },
        id_tag:{
            type: Number, 
            default: 0,
        }
    },
    {
        timestamps: false,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;