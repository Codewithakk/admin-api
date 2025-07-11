const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: { type: Date, default: Date.now },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
});

module.exports = mongoose.model('User', userSchema);
