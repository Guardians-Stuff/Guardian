const Mongoose = require('mongoose');

module.exports = Mongoose.model('Users', new Mongoose.Schema({
    user: { type: String, required: true, index: true, immutable: true },
    guild: { type: String, required: true, index: true, immutable: true },
    captcha: { type: String, default: null }
}));