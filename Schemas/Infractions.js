const Mongoose = require('mongoose');

module.exports = Mongoose.model('Infractions', new Mongoose.Schema({
    guild: { type: String, required: true, index: true, immutable: true },
    user: { type: String, required: true, index: true, immutable: true },
    issuer: { type: String, required: true, index: true, immutable: true },
    type: { type: String, index: true, required: true, immutable: true, lowercase: true, enum: [ 'ban' , 'kick', 'warning', 'timeout' ] },
    active: { type: Boolean, default: true },
    reason: { type: String, default: 'Unspecified reason.' },
    time: { type: Number, default: Date.now },
    duration: { type: Number, default: Infinity, required: true },
    expires: {
        type    : Number,
        default: function () {
            return this.time + this.duration;
        },
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: props => `${props.value} is not a time in the future!`
        }
    }
}, {
    virtuals: {
        permanent: {
            get() {
                return !isFinite(this.duration);
            }
        }
    }
}));