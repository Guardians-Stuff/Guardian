const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")


module.exports = {
    name: "setup",
    description: "Simulates",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Moderation",

    async execute(interaction, client) {


        return Reply(interaction, "✅", "I seem to have the right permissions to work perfectly fine!")
    }
}