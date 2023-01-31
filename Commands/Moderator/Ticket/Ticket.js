const Discord = require('discord.js');

const TicketClose = require('./Ticket.close');
const TicketBlock = require('./Ticket.block');
const TicketUnblock = require('./Ticket.unblock');
const TicketViewPrevious = require('./Ticket.viewPrevious');
const TicketAddUser = require('./Ticket.addUser');
const TicketRemoveUser = require('./Ticket.removeUser');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addSubcommand(TicketClose.data)
        .addSubcommand(TicketBlock.data)
        .addSubcommand(TicketUnblock.data)
        .addSubcommand(TicketViewPrevious.data)
        .addSubcommand(TicketAddUser.data)
        .addSubcommand(TicketRemoveUser.data),
    subCommands: [
        TicketClose,
        TicketBlock,
        TicketUnblock,
        TicketViewPrevious,
        TicketAddUser,
        TicketRemoveUser
    ]
}