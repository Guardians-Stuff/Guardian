const { model, Schema } = require("mongoose")

module.exports = model("levelsupChannel", new Schema({

    Guild: String,
    Channel: String

}))