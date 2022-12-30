const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js")

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDMPermission(false)
        .setDescription("Sends an invite to the support server"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        return EmbedGenerator.basicEmbed('[Click me for the support server invite!](https://discord.gg/NP8jMjW84F)')
    }
};
