const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDMPermission(false)
        .setDescription("Sends an invite of the bot to the user"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    execute(interaction, client) {
        return EmbedGenerator.basicEmbed(`[Click me for the invite to the bot!](https://discord.com/api/oauth2/authorize?client_id=1053736067129421884&permissions=8&scope=bot%20applications.commands)`);
    }
};
