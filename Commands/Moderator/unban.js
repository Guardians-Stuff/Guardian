const Discord = require(`discord.js`);

const EmbedGenerator = require('../../Functions/embedGenerator');

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
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'Unspecified reason.';

        if(!(await interaction.guild.bans.fetch(user).catch(() => null))) return { embeds: [ EmbedGenerator.errorEmbed('That user is not banned') ], ephemeral: true };

        interaction.guild.members.unban(user, reason).then(async () => {
            await Infractions.updateMany({ type: 'ban' }, { $set: { active: false } });

            return EmbedGenerator.basicEmbed(`<@${user.id}> has been unbanned. | ${reason}`);
        }).catch(() => {
            return { embeds: [ EmbedGenerator.errorEmbed() ] , ephemeral: true };
        });
    }
}