const Discord = require('discord.js');

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
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);
        /** @type {String} */ const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if (!member) return interaction.reply({ content: 'That user is no longer in the server.', ephemeral: true });

        await member.send({
            embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`You have been warned from ${interaction.guild.name} | ${reason}`) ]
        }).catch(() => null);

        await Infractions.create({
            guild: interaction.guild.id,
            user: member.id,
            issuer: interaction.user.id,
            type: 'warning',
            reason: reason
        });

        interaction.reply({ embeds: [
            new Discord.EmbedBuilder()
            .setAuthor({ name: 'Warning issued', iconURL: interaction.guild.iconURL() })
            .setColor('Gold')
            .setDescription([
                `<@${member.id}> was issued a warning by ${interaction.member}`,
                `Total Infractions: \`${(await Infractions.find({ guild: interaction.guild.id, user: member.id })).length}\``,
                `Reason: \`${reason}\``
            ].join('\n'))
            .setTimestamp()
        ] });
    }
}