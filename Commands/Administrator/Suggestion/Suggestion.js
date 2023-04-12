const Discord = require('discord.js');

const SuggestionSetup = require('./Suggestion.setup');
const SuggestionDisable = require('./Suggestion.disable');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Suggestion system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(SuggestionSetup.data)
        .addSubcommand(SuggestionDisable.data),
    subCommands: [SuggestionSetup, SuggestionDisable],
};
