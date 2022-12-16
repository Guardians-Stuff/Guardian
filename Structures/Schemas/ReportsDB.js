const { model, Schema } = require("mongoose")

module.exports = model("userreports", new Schema({

    Guild: String,
    User: String,
    ReportedBy: String,
    Reason: String,

}))