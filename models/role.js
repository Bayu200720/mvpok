import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        nama_role: {
            type: String,
            required: true,            
        }
    },
    {
        timestamps: false,
    }
);

const Role = mongoose.model('Role', RoleSchema);

export default Role;