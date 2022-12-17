const { model, Schema } = require("mongoose")

module.exports = model("level", new Schema({

    Guild: String,
    User: String,
    XP: Number,
    Level: Number

}))