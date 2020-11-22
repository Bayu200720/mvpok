import mongoose from 'mongoose';

const StatusSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        nama_Status: {
            type: String,
            required: true,            
        }
    },
    {
        timestamps: false,
    }
);

const Status = mongoose.model('Status', StatusSchema);

export default Status;