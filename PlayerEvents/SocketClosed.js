const { Client } = require("discord.js")
const { Player } = require("erela.js")

module.exports = {
    name: "socketClosed",

    async execute(player, payload, client) {
        await player.destroy()
    }
}