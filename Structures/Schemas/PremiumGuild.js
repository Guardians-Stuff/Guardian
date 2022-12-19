const { model, Schema } = require("mongoose")

module.exports = model("premium-guild", new Schema({

    Guild: String

}))