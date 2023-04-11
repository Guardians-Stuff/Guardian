const Mongoose = require('mongoose');

module.exports = Mongoose.model(
    'ReactionRoles',
    new Mongoose.Schema({
        guild: { type: String, required: true, index: true, immutable: true },
        message: { type: String, required: true, index: true, immutable: true },
        roles: { type: [String], required: true },
    })
);
