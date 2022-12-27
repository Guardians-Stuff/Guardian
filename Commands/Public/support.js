const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Sends an invite to the support server"),
    execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`[Click me for the support server invite!](https://discord.gg/NP8jMjW84F)`);

        interaction.reply({ embeds: [embed] });
    },
};
