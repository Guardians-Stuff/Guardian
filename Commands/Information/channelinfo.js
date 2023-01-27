const {
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
    time,
    SlashCommandBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channelinfo")
        .setDescription("Receive information about the current channel"),
    async execute(interaction) {
        const channel = interaction.channel;

        const replyEmbed = new EmbedBuilder()
            .setColor("blue")
            .setAuthor({
                name: `${channel.name}`,
                iconURL: interaction.guild.iconURL(),
            })
            .addFields(
                { name: `Name`, value: `${channel.name}`, inline: true },
                {
                    name: `Type`,
                    value: `${ChannelType[channel.type]}`,
                    inline: true,
                },
                {
                    name: `ID`,
                    value: `${channel.id}`,
                    inline: true,
                },
                {
                    name: `Created at`,
                    value: `${time(Math.round(channel.createdTimestamp / 1000), "D")}`,
                    inline: true,
                },
                {
                    name: `Position`,
                    value: `${channel.position}`,
                    inline: true,
                }
            )
            .setTimestamp();

        interaction.reply({
            embeds: [replyEmbed],
        });
    },
};