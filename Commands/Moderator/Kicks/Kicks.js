const Discord = require('discord.js');

const KicksView = require('./Kicks.view');
const KicksRemoveLog = require('./Kicks.removelog');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('kicks')
        .setDescription('Kick logging system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addSubcommand(KicksView.data)
        .addSubcommand(KicksRemoveLog.data),
    subCommands: [KicksView, KicksRemoveLog],
};
