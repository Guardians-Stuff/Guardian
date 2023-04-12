const Discord = require('discord.js');
const ms = require('ms');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('timeout')
        .setDMPermission(false)
        .setDescription('Timeout a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription("The user you'd like to timeout.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('How long to timeout the user for.')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for the timeout.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch({ user: user.id }).catch(() => null);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        const duration = await interaction.options.getString('duration', true);
        const durationMs = ms(duration);
        if (!durationMs || isNaN(durationMs))
            return { embeds: [EmbedGenerator.errorEmbed('Invalid duration.')], ephemeral: true };
        if (durationMs < 1000)
            return {
                embeds: [EmbedGenerator.errorEmbed('Duration must be longer than 1s')],
                ephemeral: true,
            };
        if (durationMs > ms('28d'))
            return { embeds: [EmbedGenerator.errorEmbed('Duration must be shorter than 28d')] };

        if (!member)
            return {
                embeds: [EmbedGenerator.errorEmbed('That user is no longer in the server.')],
                ephemeral: true,
            };
        if (!member.moderatable)
            return {
                embeds: [EmbedGenerator.errorEmbed('User cannot be issued a timeout.')],
                ephemeral: true,
            };

        const infractionEmbed = EmbedGenerator.infractionEmbed(
            interaction.guild,
            interaction.user.id,
            'Timeout',
            durationMs,
            Date.now() + durationMs,
            reason
        );
        await member.send({ embeds: [infractionEmbed] }).catch(() => null);

        member
            .timeout(durationMs, reason)
            .then(async () => {
                await client.expiringDocumentsManager.infractions.addNewDocument(
                    await Infractions.create({
                        guild: interaction.guild.id,
                        user: member.id,
                        issuer: interaction.user.id,
                        type: 'timeout',
                        reason: reason,
                        duration: durationMs,
                    })
                );

                interaction.reply({ embeds: [infractionEmbed] });
            })
            .catch(() => {
                interaction.reply({ embeds: [EmbedGenerator.errorEmbed()] });
            });
    },
};
