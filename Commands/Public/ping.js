const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require("discord.js")

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        return { content: 'Pong!', ephemeral: true };
    }
}