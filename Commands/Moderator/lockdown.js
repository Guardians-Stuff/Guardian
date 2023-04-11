const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('lockdown')
        .setDMPermission(false)
        .setDescription('Prevents members from sending messages in the channel.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for locking the channel.')
        ),
    /**
     *
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';
        /** @type {Discord.TextChannel} */ const channel = interaction.channel;

        channel.permissionOverwrites
            .edit(interaction.guild.roles.everyone, { SendMessages: false })
            .then(() => {
                interaction.reply({
                    embeds: [EmbedGenerator.basicEmbed(`This channel has been locked | ${reason}`)],
                });
            })
            .catch(() => {
                interaction.reply({ embeds: [EmbedGenerator.errorEmbed()], ephemeral: true });
            });
    },
};
