const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const math = require("mathjs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculate numbers! !')
        .addStringOption(option => option.setName('expression')
        .setDescription('Example : 2*3+5')
        .setRequired(true)),
    async execute(interaction, client) {
        let expression = interaction.options.getString('expression');
        let result;
        try{
            result = math.evaluate(expression);
        } catch (e) {
            const fail = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`🔢 **Write your expression**\n\n> \`/calc 5*2+9\``)
            return interaction.reply({ embeds : [ fail ], ephemeral:true });;
        };
        const calc = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<:blurple_bot:1115465243649380452> **${expression}**\n\n> ${result}`)
        return interaction.reply({embeds:[calc]});
    }
}