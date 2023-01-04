const Discord = require('discord.js');

const GiveawayCreate = require('./Giveaway/Giveaway.create');
const GiveawayCancel = require('./Giveaway/Giveaway.cancel');
const GiveawayEnd = require('./Giveaway/Giveaway.end');
const GiveawayReroll = require('./Giveaway/Giveaway.reroll');

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