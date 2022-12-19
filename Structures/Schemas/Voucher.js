const { model, Schema } = require("mongoose")

module.exports = model("vouchers", new Schema({

    ThirtyDay: String,
    TwoMonth: String

}))