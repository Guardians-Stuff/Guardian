const { PermissionFlagsBits, EmbedBuilder, SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Get a random cat image!"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Meow!")
            .setImage(`https://cataas.com/cat?${Date.now()}`)
            .setColor("Blue")
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL()}`,
            });

        await interaction.reply({ embeds: [embed] });
    },
};