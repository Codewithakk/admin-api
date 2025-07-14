const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a role name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Role name cannot be more than 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }],
});

module.exports = mongoose.model('Role', roleSchema);