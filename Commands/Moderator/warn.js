const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`The user you'd like to warn.`)
            .setRequired(true)
        ).addStringOption(option => option
            .setName(`reason`)
            .setDescription(`Reason for warning the user.`)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if (!member) return { embeds: [ EmbedGenerator.errorEmbed('That user is no longer in the server.') ], ephemeral: true };

        await member.send({
            embeds: [ EmbedGenerator.basicEmbed(`You have been warned from ${interaction.guild.name} | ${reason}`) ]
        }).catch(() => null);

        await Infractions.create({
            guild: interaction.guild.id,
            user: member.id,
            issuer: interaction.user.id,
            type: 'warning',
            reason: reason
        });

        return EmbedGenerator.basicEmbed()
            .setAuthor({ name: 'Warning issued', iconURL: interaction.guild.iconURL() })
            .setDescription([
                `<@${member.id}> was issued a warning by ${interaction.member}`,
                `Total Infractions: \`${(await Infractions.find({ guild: interaction.guild.id, user: member.id })).length}\``,
                `Reason: \`${reason}\``
            ].join('\n'))
            .setTimestamp()
    }
}