const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = Schema ({
    facebook_id: String,
    name: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
})

const User = mongoose.model('User', usersSchema);

module.exports = User