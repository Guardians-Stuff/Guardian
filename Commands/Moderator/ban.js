const Discord = require(`discord.js`);
const ms = require('ms');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you\'d like to ban.')
            .setRequired(true)
        ).addStringOption(option => option
            .setName('delete_messages')
            .setDescription('How much of their recent message history to delete.')
            .addChoices(
                { name: 'Don\'t delete any', value: '0s' },
                { name: 'Previous Hour', value: '1h' },
                { name: 'Previous 6 Hours', value: '6h' },
                { name: 'Previous 12 Hours', value: '12h' },
                { name: 'Previous 24 Hours', value: '24h' },
                { name: 'Previous 3 Days', value: '3d' },
                { name: 'Previous 7 Days', value: '7d' }
            )
            .setRequired(true)
        ).addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for banning the user.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);
        const deleteMessages = interaction.options.getString('delete_messages', true);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if (!member) return interaction.reply({ content: 'That user is no longer in the server.', ephemeral: true });
        if (!member.bannable) return interaction.reply({ content: 'User cannot be banned.', ephemeral: true });

        await member.send({
            embeds: [ EmbedGenerator.basicEmbed(`You have been banned from ${interaction.guild.name} | ${reason}`) ]
        }).catch(() => null);

        member.ban({
            reason: reason,
            deleteMessageSeconds: ms(deleteMessages) / 1000
        }).then(async () => {
            await Infractions.create({
                guild: interaction.guild.id,
                user: member.id,
                issuer: interaction.user.id,
                type: 'ban',
                reason: reason
            })

            interaction.reply({ embeds: [
                EmbedGenerator.basicEmbed([
                    `<@${member.id}> was issued a permenant ban by ${interaction.member}`,
                    `Total Infractions: \`${(await Infractions.find({ guild: interaction.guild.id, user: member.id })).length}\``,
                    `Reason: \`${reason}\``
                ].join('\n'))
                .setAuthor({ name: 'Ban issued', iconURL: interaction.guild.iconURL() })
                .setTimestamp()
            ] })
        }).catch(() => {
            interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true })
        });
    }
}