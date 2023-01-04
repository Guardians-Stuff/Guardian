const Discord = require('discord.js');

const WarnsView = require('./Warns.view');
const WarnsRemoveLog = require('./Warns.removelog');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('warns')
        .setDescription('Warn logging system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addSubcommand(WarnsView.data)
        .addSubcommand(WarnsRemoveLog.data),
    subCommands: [
        WarnsView,
        WarnsRemoveLog
    ]
}