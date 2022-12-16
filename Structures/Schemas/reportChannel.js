const { model, Schema} = require("mongoose")

module.exports = model("reportChannel", new Schema({

    Guild: String,
    Channel: String

}))