const Discord = require(`discord.js`);
const ms = require('ms');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you\'d like to ban.')
            .setRequired(true))
        .addStringOption(option => option
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
        )
        .addStringOption(option => option
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

        if (!member) return interaction.reply({ content: 'That user is no longer in the server.', ephemeral: true });
        if (!member.bannable) return interaction.reply({ content: 'User cannot be banned.', ephemeral: true });

        await member.send({
            embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`You have been banned from ${interaction.guild.name} | ${reason}`) ]
        }).catch(() => null);

        member.ban({
            reason: reason,
            deleteMessageSeconds: ms(deleteMessages) / 1000
        }).then(() => {
            interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`<@${user.id}> has been banned. | ${reason}`) ] })
        }).catch(() => {
            interaction.reply({ content: 'There was an error.', ephemeral: true })
        });
    }
}