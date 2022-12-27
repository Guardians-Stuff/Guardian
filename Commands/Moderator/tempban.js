const Discord = require(`discord.js`);
const ms = require('ms');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Temporarily bans a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you\'d like to tempban.')
            .setRequired(true)
        ).addStringOption(option => option
            .setName('duration')
            .setDescription('How long to tempban the user for.')
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
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);
        const deleteMessages = interaction.options.getString('delete_messages', true);
        /** @type {String} */ const reason = interaction.options.getString('reason') || 'Unspecified reason.';
        
        /** type {String} */ const duration = await interaction.options.getString('duration', true);
        const durationMs = ms(duration);
        if(!durationMs || isNaN(durationMs)) return interaction.reply({ content: 'Invalid duration', ephemeral: true });
        if(durationMs < 1000) return interaction.reply({ content: 'Duration must be longer than 1s', ephemeral: true });

        if(!member) return interaction.reply({ content: 'That user is no longer in the server.', ephemeral: true });
        if(!member.bannable) return interaction.reply({ content: 'User cannot be banned.', ephemeral: true });

        await member.send({
            embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`You have been banned from ${interaction.guild.name} for ${ms(durationMs, { long: true })} | ${reason}`) ]
        }).catch(() => null);

        member.ban({
            reason: reason,
            deleteMessageSeconds: ms(deleteMessages) / 1000
        }).then(async () => {
            await client.expiringDocumentsManager.punishments.addNewDocument(await Infractions.create({
                guild: interaction.guild.id,
                user: member.id,
                issuer: interaction.user.id,
                type: 'ban',
                reason: reason,
                duration: durationMs
            }));

            interaction.reply({ embeds: [
                new Discord.EmbedBuilder()
                .setAuthor({ name: 'Ban issued', iconURL: interaction.guild.iconURL() })
                .setColor('Green')
                .setDescription([
                    `<@${member.id}> was issued a temporary ban by ${interaction.member}`,
                    `Total Infractions: \`${(await Infractions.find({ guild: interaction.guild.id, user: member.id })).length}\``,
                    `Duration: **${ms(durationMs, { long: true })}**`,
                    `Reason: \`${reason}\``,
                ].join('\n'))
                .setTimestamp()
            ] })
        });
    }
}