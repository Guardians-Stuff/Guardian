const Discord = require('discord.js');

const GiveawayCreate = require('./Giveaway.create');
const GiveawayCancel = require('./Giveaway.cancel');
const GiveawayEnd = require('./Giveaway.end');
const GiveawayReroll = require('./Giveaway.reroll');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Giveaway system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(GiveawayCreate.data)
        .addSubcommand(GiveawayCancel.data)
        .addSubcommand(GiveawayEnd.data)
        .addSubcommand(GiveawayReroll.data),
    subCommands: [
        GiveawayCreate,
        GiveawayCancel,
        GiveawayEnd,
        GiveawayReroll
    ]
}