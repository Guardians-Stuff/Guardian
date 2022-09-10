const { model, Schema } = require("mongoose")

module.exports = model("generallogs", new Schema({
    Guild: String, 
    MemberRole: Boolean,
    MemberNick: Boolean,
    ChannelTopic: Boolean,
    MemberBoost: Boolean,
    RoleStatus: Boolean,
    ChannelStatus: Boolean,
    EmojiStatus: Boolean,
    MemberBan: Boolean,
}))