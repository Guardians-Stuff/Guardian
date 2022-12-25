const { model, Schema } = require("mongoose")

module.exports = model("Infractions", new Schema({
    Guild: String,
    User: String,
    Infractions: Array
}))