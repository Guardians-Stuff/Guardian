const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('hack')
        .setDescription('Hack into the mainframe!')
        .addStringOption((option) =>
            option.setName('target').setDescription('The target to hack').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('method').setDescription('The method of hacking').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('level').setDescription('The level of hacking').setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputApplicationCommandData} interaction
     */
    async execute(interaction) {
        const target = interaction.options.getString('target');
        const method = interaction.options.getString('method');
        const level = interaction.options.getString('level');
        await interaction.reply(`Hacking into ${target} using ${method} at level ${level}...`);
        // Insert advanced fake hack code here
    },
};
