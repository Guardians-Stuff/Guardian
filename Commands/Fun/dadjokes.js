const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder().setName('dadjoke').setDescription('Receive a random dad joke!'),
    async execute(interaction) {
        dadJokesTxt = fs.readFileSync('./data/dadjokes.txt');
        dadJokesTxt = dadJokesTxt.toString();
        dadJokesTxt = dadJokesTxt.split('\n');
        randomNum = Math.floor(Math.random() * 710);

        interaction.reply({ content: dadJokesTxt[randomNum], ephemeral: true });
    },
};
