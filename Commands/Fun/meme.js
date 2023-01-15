const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('meme')
        .setDescription('Send a fantastic meme.')
        .setDMPermission(false),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        return { content: '🪞' };
    }
}