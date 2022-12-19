const { model, Schema } = require("mongoose")

module.exports = model("vouchers", new Schema({

    User: String,
    ThirtyDay: String,
    //TwoMonth: String

}))