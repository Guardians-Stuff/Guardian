const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.KickMembers)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`The user you'd like to kick.`)
            .setRequired(true)
        ).addStringOption(option => option
            .setName(`reason`)
            .setDescription(`Reason for kicking the user.`)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if (!member) return interaction.reply({ content: 'That user is no longer in the server.', ephemeral: true });
        if (!member.kickable) return interaction.reply({ content: 'User cannot be kicked.', ephemeral: true });

        await member.send({
            embeds: [ EmbedGenerator.basicEmbed(`You have been kicked from ${interaction.guild.name} | ${reason}`) ]
        }).catch(() => null);

        member.kick(reason).then(async () => {
            await Infractions.create({
                guild: interaction.guild.id,
                user: member.id,
                issuer: interaction.user.id,
                type: 'kick',
                reason: reason
            });

            interaction.reply({ embeds: [
                EmbedGenerator.basicEmbed([
                    `<@${member.id}> was issued a kick by ${interaction.member}`,
                    `Total Infractions: \`${(await Infractions.find({ guild: interaction.guild.id, user: member.id })).length}\``,
                    `Reason: \`${reason}\``
                ].join('\n'))
                .setAuthor({ name: 'Kick issued', iconURL: interaction.guild.iconURL() })
                .setTimestamp()
            ] })
        }).catch(() => {
            interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
        });
    }
}