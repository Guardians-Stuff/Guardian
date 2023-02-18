const Mongoose = require('mongoose');

module.exports = Mongoose.model('Members', new Mongoose.Schema({
    member: { type: String, required: true, index: true, immutable: true },
    guilds: { type: [String], required: true, index: true, default: [] }
}));