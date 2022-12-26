const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Sends an invite of the bot to the user"),
    execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`[Click me for the invite to the bot!](https://discord.com/api/oauth2/authorize?client_id=1053736067129421884&permissions=8&scope=bot%20applications.commands)`);

        interaction.reply({ embeds: [embed] });
    },
};
