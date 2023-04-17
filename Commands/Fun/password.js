const Discord = require('discord.js');
const passwordGenerator = require('generate-password');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('generate-password')
        .setDescription('Generate a secure password.')
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('length').setDescription('Length of the password').setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName('numbers').setDescription('Include numbers').setRequired(false)
        )
        .addBooleanOption((option) =>
            option.setName('symbols').setDescription('Include symbols').setRequired(false)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const length = interaction.options.getString('length');
        const numbers = interaction.options.getBoolean('numbers');
        const symbols = interaction.options.getBoolean('symbols');
        const password = passwordGenerator.generate({
            length: length,
            numbers: numbers,
            symbols: symbols,
        });
        await interaction.user.send(`Your secure password is: ${password}`);
        await interaction.reply('I have sent you a DM with your secure password!');
    },
};
