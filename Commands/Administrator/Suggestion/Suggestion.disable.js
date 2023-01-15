const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('disable')
        .setDescription('Disable the suggestion system.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        dbGuild.suggestion.enabled = false;
        dbGuild.suggestion.reactions = false;

        return EmbedGenerator.basicEmbed('The Suggestion system has disabled.');
    }
}