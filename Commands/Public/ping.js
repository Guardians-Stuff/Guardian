const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Discord.Client} client 
     */
    execute(interaction, client) {
        return { content: 'Pong!', ephemeral: true };
    }
}