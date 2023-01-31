const Mongoose = require('mongoose');

module.exports = Mongoose.model('Tickets', new Mongoose.Schema({
    guild: { type: String, required: true, index: true, immutable: true },
    user: { type: String, required: true, index: true, immutable: true },
    channel: { type: String, required: true, index: true, immutable: true },
    messages : { type: [ {
        user   : { type: String, required: true },
        message: { type: String, required: true },
        time   : { type: Number, default: Date.now },
        images : { type: [ String ], default: [] }
    } ], default: [] },
    active: { type: Boolean, default: true }
}));