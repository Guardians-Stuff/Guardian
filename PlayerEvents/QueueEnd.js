const { Client } = require("discord.js")
const { Player } = require("erela.js")

module.exports = {
    name: "queueEnd",

    async execute(player, track, type, client) {
        await player.destroy()
    }
}