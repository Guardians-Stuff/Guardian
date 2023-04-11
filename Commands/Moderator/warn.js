const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('warn')
        .setDMPermission(false)
        .setDescription('Warns a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option.setName(`user`).setDescription(`The user you'd like to warn.`).setRequired(true)
        )
        .addStringOption((option) =>
            option.setName(`reason`).setDescription(`Reason for warning the user.`)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch({ user: user.id }).catch(() => null);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if (!member)
            return {
                embeds: [EmbedGenerator.errorEmbed('That user is no longer in the server.')],
                ephemeral: true,
            };

        const infractionEmbed = EmbedGenerator.infractionEmbed(
            interaction.guild,
            interaction.user.id,
            'Warning',
            null,
            null,
            reason
        );
        await member.send({ embeds: [infractionEmbed] }).catch(() => null);

        await Infractions.create({
            guild: interaction.guild.id,
            user: member.id,
            issuer: interaction.user.id,
            type: 'warning',
            reason: reason,
            active: false,
        });

        return infractionEmbed;
    },
};
