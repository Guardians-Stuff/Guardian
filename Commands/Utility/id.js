const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('Get the ID of a user or yourself.')
        .addUserOption(option => option.setName('user')
        .setDescription('The user you want to get the ID of')
        .setRequired(false)),
    async execute(interaction, client) {
        let person = interaction.options.getUser('user');
        if (!person) person = interaction.user;
        const id = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`${person} <:blurple_line:1115975887939182612> **${person.id}**`)
            .setFooter({text:`The ID of the user pinged.`})
        interaction.reply({ embeds: [id] });
    }
}