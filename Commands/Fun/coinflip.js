const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.')
        .setDMPermission(false),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        return EmbedGenerator.basicEmbed(Math.random() > 0.5 ? 'Heads' : 'Tails');
    }
}