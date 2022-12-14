const { model, Schema } = require("mongoose")

module.exports = model("money-action", new Schema({

    User: String,
    Daily: Number

})) 