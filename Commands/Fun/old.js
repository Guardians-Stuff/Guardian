const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('oldest')
        .setDescription('Locate the oldest member in the server.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const oldestMember = interaction.guild.members.cache
            .sort((a, b) => a.user.createdAt - b.user.createdAt)
            .first();
        await interaction.reply(`The oldest member in the server is ${oldestMember.user.tag}.`);
    },
};
