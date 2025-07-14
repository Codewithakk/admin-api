const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a permission name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Permission name cannot be more than 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
});

module.exports = mongoose.model('Permission', permissionSchema);