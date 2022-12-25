const { Schema, model } = require("mongoose")

module.exports = model("MemberLog", new Schema({
    Guild: String,
    logChannel: String,
    memberRole: String,
    botRole: String
}))