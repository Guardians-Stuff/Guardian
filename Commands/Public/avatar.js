const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Gets the avatar of a user")
        .addUserOption(option => option.setName("user").setDescription("The user to get the avatar of")),
    execute: interaction => {
        const user = interaction.options.getUser("user") || interaction.user;

        const embed = new EmbedBuilder()
            .setDescription(`🖼️ **Avatar of ${user.tag}**\n [Click Here](${user.displayAvatarURL({ size: 4096 })})`)
            .setColor("Green")
            .setImage(user.displayAvatarURL({ size: 512 }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ size: 4096 }) })

        interaction.reply({ embeds: [embed] });

    },
};

