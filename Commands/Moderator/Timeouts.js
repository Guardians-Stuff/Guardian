const Discord = require('discord.js');

const TimeoutsView = require('./Timeouts/Timeouts.view');
const TimeoutsRemoveLog = require('./Timeouts/Timeouts.removelog');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('timeouts')
        .setDescription('Timeout logging system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addSubcommand(TimeoutsView.data)
        .addSubcommand(TimeoutsRemoveLog.data),
    subCommands: [
        TimeoutsView,
        TimeoutsRemoveLog
    ]
}