const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "ping",
    description: "Bot's ping.",
    category: "Information",

    async execute(interaction, client) {

        return Reply(interaction, "⏳", `The current Websocket Latency is : \`${client.ws.ping} ms\``, false)
    }
}