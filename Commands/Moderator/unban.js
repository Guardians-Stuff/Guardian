const Discord = require(`discord.js`);

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you\'d like to unban.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unbanning the user.')
        ),
    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        /** @type {String} */ const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if(!(await interaction.guild.bans.fetch(user).catch(() => null))) return interaction.reply({ content: 'That user is not banned.', ephemeral: true });

        interaction.guild.members.unban(user, reason).then(async () => {
            await Infractions.updateMany({ type: 'ban' }, { $set: { active: false } });

            interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`<@${user.id}> has been unbanned. | ${reason}`) ] })
        }).catch(() => {
            interaction.reply({ content: 'There was an error.', ephemeral: true })
        });
    }
}