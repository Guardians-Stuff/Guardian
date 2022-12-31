const Mongoose = require('mongoose');

module.exports = Mongoose.model('Guilds', new Mongoose.Schema({
    guild: { type: String, required: true, index: true, immutable: true },
    verification: {
        enabled: { type: Boolean, default: false },
        version: { type: String, enum: [ null, 'button', 'command', 'captcha' ], default: null },
        role: { type: String, default: null },
        channel: { type: String, default: null }
    },
    logs: {
        // enabled: { type: Boolean, default: false },
        basic: { type: String, default: null },
        moderator: { type: String, default: null }
    },
    autorole: {
        // enabled: { type: Boolean, default: false },
        member: { type: String, default: null },
        bot: { type: String, default: null }
    },
    antiraid: {
        enabled: { type: Boolean, default: false },
        raid: { type: Boolean, default: false },
        joinAmount: { type: Number, default: 20 },
        joinWithin: { type: Number, default: 2 },
        action: { type: String, enum: [ null, 'kick', 'ban' ], default: 'kick' },
        lockdown: {
            enabled: { type: Boolean, default: true },
            active: { type: Boolean, default: false }
        },
        channel: { type: String, default: null }
    }
}));

/**
 * --plan--
 * guild: id
 * verification: {
 *  enabled: boolean
 *  version: button | command | captcha
 *  role: id
 *  channel: id
 * },
 * logs: {
 *  enabled: boolean
 *  basic: id
 *  moderator: id
 * },
 * autorole: {
 *  enabled: boolean
 *  members: id
 *  bots: id
 * },
 * join: {
 *  enabled: boolean
 *  channel: id
 *  dm: boolean
 *  formatting: {
 *    text: 'Welcome to <server>'
 *    textColor: #ffffff
 *    backgroundImage: something
 *  }
 * }
 * leave: {
 *  enabled: boolean
 *  channel: id
 * }
 * other stuff?
 */