const Mongoose = require('mongoose');

module.exports = Mongoose.model(
    'Giveaways',
    new Mongoose.Schema(
        {
            giveaway: { type: String, required: true, index: true, immutable: true },
            guild: { type: String, required: true, index: true, immutable: true },
            channel: { type: String, required: true, immutable: true },
            entries: { type: [String], default: [] },
            winners: { type: Number, required: true },
            description: { type: String, default: null },
            active: { type: Boolean, default: true },
            time: { type: Number, default: Date.now },
            duration: { type: Number, default: Infinity, required: true },
            expires: {
                type: Number,
                default: function () {
                    return this.time + this.duration;
                },
            },
        },
        {
            virtuals: {
                permanent: {
                    get() {
                        return !isFinite(this.duration);
                    },
                },
            },
        }
    )
);
