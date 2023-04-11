const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('disable')
        .setDescription('Disable the verification system.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        if (!dbGuild.verification.enabled)
            return EmbedGenerator.errorEmbed('The verification system is not enabled!');

        dbGuild.verification.enabled = false;
        dbGuild.verification.version = null;
        dbGuild.verification.channel = null;
        dbGuild.verification.role = null;

        return EmbedGenerator.basicEmbed('🔓 | Member verification has been disabled.');
    },
};
