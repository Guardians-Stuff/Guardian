const Mongoose = require('mongoose');

module.exports = Mongoose.model(
    'Reminders',
    new Mongoose.Schema(
        {
            user: { type: String, required: true, index: true, immutable: true },
            reminder: { type: String, required: true },
            repeating: { type: Boolean, default: false, required: true },
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
