const { model, Schema } = require("mongoose")

module.exports = model("blacklist-guild", new Schema({
    Guild: String,
    Reason: String,
    Time: Number,
}))