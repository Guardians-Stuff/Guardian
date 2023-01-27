const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDefaultMemberPermissions(PermissionFlagsBits.EmbedLinks)
        .setDescription("Returns a list of all roles in the guild"),
    async execute(interaction) {
        const roles = await Promise.resolve(
            interaction.guild.roles.fetch().then((roles) => {
                return roles
                    .filter((role) => role.id !== interaction.guild.id)
                    .toJSON()
                    .join("\n");
            })
        );
        const replyEmbed = new EmbedBuilder()
            .setColor("blue")
            .addFields({
                name: "Roles",
                value: `${roles}`,
                inline: true,
            })
            .setFooter({ text: `${interaction.guild.id}` })
            .setTimestamp();

        interaction.reply({
            embeds: [replyEmbed],
        });
    },
};