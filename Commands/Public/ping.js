const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    execute(interaction) {
        interaction.reply({ content: "pong!", ephemeral: true })
    }
}