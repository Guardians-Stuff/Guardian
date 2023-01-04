const Discord = require('discord.js');

const AutoRoleSetup = require('./AutoRole.setup');
const AutoRoleDisable = require('./AutoRole.disable');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('autorole')
        .setDescription('Autorole system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(AutoRoleSetup.data)
        .addSubcommand(AutoRoleDisable.data),
    subCommands: [
        AutoRoleSetup,
        AutoRoleDisable
    ]
}