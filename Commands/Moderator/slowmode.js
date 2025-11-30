const Discord = require('discord.js');
const ms = require('ms');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('slowmode')
        .setDMPermission(false)
        .setDescription('Sets the slowmode of the channel.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('Duration between sending messages in the channel.')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for setting the slowmode.')
        ),
    /**
     *
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const duration = interaction.options.getString('duration', true);
        const durationSeconds = Math.floor(ms(duration) / 1000);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';
        /** @type {Discord.TextChannel} */ const channel = interaction.channel;

        if (isNaN(durationSeconds))
            return interaction.reply({ content: 'Invalid duration.', ephemeral: true });
        if (durationSeconds < 0)
            return interaction.reply({
                content: 'Duration must not be less than 0 seconds.',
                ephemeral: true,
            });
        if (durationSeconds > 21600)
            return interaction.reply({
                content: 'Duration must not be greater than 6 hours.',
                ephemeral: true,
            });

        channel
            .setRateLimitPerUser(durationSeconds, reason)
            .then(() => {
                const durationString =
                    durationSeconds === 0 ? 'disabled' : ms(ms(duration), { long: true });
                interaction.reply({
                    embeds: [
                        EmbedGenerator.basicEmbed(
                            `The slowmode for this channel is now ${durationString} | ${reason}`
                        ),
                    ],
                });
            })
            .catch(() => {
                interaction.reply({
                    embeds: [EmbedGenerator.errorEmbed('There was an error.')],
                    ephemeral: true,
                });
            });
    },
};
