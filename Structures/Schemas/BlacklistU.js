const { model, Schema } = require("mongoose")

module.exports = model("blacklist-user", new Schema({
    Guild: String,
    Reason: String,
    Time: Number,
}))