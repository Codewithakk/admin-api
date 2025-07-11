const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    name: { type: String, unique: true },
    description: String,
});

module.exports = mongoose.model('Permission', permissionSchema);
