const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fakenitro')
        .setDescription('Generates a random nitro link.'),
    category: 'Fun',
    cooldown: 0,
    execute(interaction) {
        const letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += letters[Math.floor(Math.random() * letters.length)];
        }

        interaction.reply({ content: `http://discord.gift/${result}` });
    },
};
