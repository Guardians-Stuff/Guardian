const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Receive a random joke from a category')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('The category of the joke')
                .setRequired(true)
                .addChoices(
                    { name: 'Motivational', value: 'Motivationalquotes.txt' },
                    { name: 'Scientific', value: 'Scientific.txt' }
                )
        ),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        let fileSize = 0;

        switch (category) {
            case 'Motivationalquotes.txt':
                fileSize = 418;
                break;
            case 'Scientific.txt':
                fileSize = 25;
                break;
            default:
                fileSize = 0;
        }

        txtfile = fs.readFileSync(`./data/quotes/${category}`);
        txtfile = txtfile.toString();
        txtfile = txtfile.split('\n');
        randomNum = Math.floor(Math.random() * fileSize);

        interaction.reply({ content: txtfile[randomNum], ephemeral: true });
    },
};
