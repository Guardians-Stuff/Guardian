const { model, Schema } = require("mongoose")

module.exports = model("warnings", new Schema({
    User: String,
    Guild: String,
    Moderator: String,
    Reason: String,
    Timestamp: String,
}))