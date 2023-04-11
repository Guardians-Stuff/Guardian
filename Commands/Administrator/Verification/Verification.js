const Discord = require('discord.js');

const VerificationSetup = require('./Verification.setup');
const VerificationDisable = require('./Verification.disable');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('verification')
        .setDescription('Verification system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(VerificationSetup.data)
        .addSubcommand(VerificationDisable.data),
    subCommands: [VerificationSetup, VerificationDisable],
};
