const { model, Schema } = require("mongoose")

module.exports = model("account", new Schema({

    User: String,
    Bank: Number,
    Wallet: Number,
    Inventory: Object

})) 