const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Gets the avatar of a user")
        .addUserOption(option => option.setName("user").setDescription("The user to get the avatar of")),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.user;

        return EmbedGenerator.basicEmbed(`🖼️ **Avatar of ${user.tag}**\n [Click Here](${user.displayAvatarURL({ size: 4096 })})`)
            .setImage(user.displayAvatarURL({ size: 512 }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ size: 4096 }) })
    }
};

