const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "skip",
    description: "Skips the current song.",
    premium: true,
    category: "Music",

    async execute(interaction, client) {

        const { guild, member } = interaction

        const Manager = client.player
        const player = Manager.players.get(guild.id)
        if (!player) return Reply(interaction, "❌", `No player is here`, true)

        const VC = member.voice.channel
        if (!VC) return EditReply(interaction, "❌", `You need to be in a VC!`, true)

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return EditReply(interaction, "❌", `You need to be in the same VC as me to play a song.`, true)

        await interaction.deferReply()

        await player.stop()

        EditReply(interaction, "🎶", `The player has been skipped.`)
    
    }
}