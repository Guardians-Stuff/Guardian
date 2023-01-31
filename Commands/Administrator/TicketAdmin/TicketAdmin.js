const Discord = require('discord.js');

const TicketAdminSetup = require('./TicketAdmin.setup');
const TicketAdminDisable = require('./TicketAdmin.disable');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket_admin')
        .setDescription('Ticket system management.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(TicketAdminSetup.data)
        .addSubcommand(TicketAdminDisable.data),
    subCommands: [
        TicketAdminSetup,
        TicketAdminDisable,
    ]
}