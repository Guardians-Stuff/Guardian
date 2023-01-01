const Discord = require('discord.js');

const LoggingSetup = require('./Logging.setup');
const LoggingDisable = require('./Logging.disable');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('logging')
        .setDescription('Logging system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(LoggingSetup.data)
        .addSubcommand(LoggingDisable.data),
    subCommands: [
        LoggingSetup,
        LoggingDisable
    ]
}