const { Client, ChannelType } = require("discord.js")
const { Player } = require("erela.js")

module.exports = {
    name: "trackStart",

    async execute(player, track, type, client) {
        const Channel = client.channels.cache.get(player.textChannel)
        if (!Channel) return 
        if (Channel.type !== ChannelType.GuildText) return 

        Channel.send({ context: `Started playing ${track.title}` })
    }
}