const Discord = require(`discord.js`);

module.exports = {
    developer: true,
    data: new Discord.SlashCommandBuilder()
        .setName('listservers')
        .setDescription('Lists all servers the bot is in.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const guilds = client.guilds.cache.map((guild) => guild.name).join('\n');
        const embed = new Discord.EmbedBuilder()
            .setTitle('List of Servers')
            .setDescription(guilds)
            .setColor('#0099ff');
        await interaction.reply({ embeds: [embed] });
    },
};
