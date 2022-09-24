const { model, Schema} = require("mongoose")

module.exports = model("verification", new Schema({

    Guild: String, 
    Role: String
}))