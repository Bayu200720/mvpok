import mongoose from 'mongoose';

const TagSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        nama_Tag: {
            type: String,
            required: true,            
        }
    },
    {
        timestamps: false,
    }
);

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;