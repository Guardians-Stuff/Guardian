const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { randomNumber } = require('../../Functions/randomNumber');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('dice')
        .setDescription('Roll a dice.')
        .setDMPermission(false)
        .addNumberOption(option => option
            .setName('sides')
            .setDescription('How many sides the dice to roll has.')
            .setMinValue(1)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const sides = interaction.options.getNumber('sides') || 6;

        return EmbedGenerator.basicEmbed(`🎲 | The dice rolled \`${randomNumber(1, sides)}\``)
            .setAuthor({ name: `Rolling a ${sides} sided dice` });
    }
}