import mongoose from 'mongoose'

const secretcodeSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 600 } //exp:10menit
});

const Secretcode = mongoose.model('Secretcode', secretcodeSchema);

export default Secretcode;