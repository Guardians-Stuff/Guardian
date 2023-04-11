const Discord = require('discord.js');

const AntiRaidSetup = require('./AntiRaid.setup');
const AntiRaidDisable = require('./AntiRaid.disable');
const AntiRaidStartRaid = require('./AntiRaid.StartRaid');
const AntiRaidStopRaid = require('./AntiRaid.StopRaid');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('antiraid')
        .setDescription('Anti-raid protection system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(AntiRaidSetup.data)
        .addSubcommand(AntiRaidDisable.data)
        .addSubcommand(AntiRaidStartRaid.data)
        .addSubcommand(AntiRaidStopRaid.data),
    subCommands: [AntiRaidSetup, AntiRaidDisable, AntiRaidStartRaid, AntiRaidStopRaid],
};
