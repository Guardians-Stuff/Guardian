const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('disable')
        .setDescription('Disable the logging system.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        if (!dbGuild.logs.enabled)
            return EmbedGenerator.errorEmbed('The logging system is not enabled!');

        dbGuild.logs.enabled = true;
        dbGuild.logs.basic = null;
        dbGuild.logs.moderator = null;

        return EmbedGenerator.basicEmbed('🔓 | The logging system has been disabled!');
    },
};
