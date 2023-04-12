const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('isbanned')
        .setDescription('Check if a user is banned or not via user id.')
        .addStringOption((option) =>
            option.setName('user-id').setDescription('The user ID to check.').setRequired(true)
        )
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const userId = interaction.options.getString('user-id');
        const bannedUsers = await interaction.guild.bans.fetch();
        const isBanned = bannedUsers.has(userId);
        interaction.reply(`User with ID ${userId} is ${isBanned ? 'banned' : 'not banned'}.`);
    },
};
