const { PermissionFlagsBits, ChannelType, SlashCommandBuilder } = require("discord.js");

const requiredPerms = {
    type: "flags",
    key: [PermissionFlagsBits.SendMessages],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Announce a message to the server")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Channel to announce the message in")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Message to announce")
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const message = interaction.options.getString("message");

        if (
            !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
        ) {
            return interaction.reply({
                content: ":wrench: You do not have the `ADMINISTRATOR` permission!",
                ephemeral: true,
            });
        }
        if (
            !channel
                .permissionsFor(interaction.guild.members.me)
                .has(PermissionFlagsBits.SendMessages)
        ) {
            return interaction.reply({
                content:
                    ":wrench: I do not have permissions to send messages in this channel!",
                ephemeral: true,
            });
        }

        channel.send(message);

        interaction.reply({
            content: `:mega: Announced message successfully! <#${channel.id}>`,
            ephemeral: true,
        });
    },
    requiredPerms: requiredPerms,
};