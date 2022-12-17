const { model, Schema } = require("mongoose")

module.exports = model("premium-user", new Schema({

    User: String

}))