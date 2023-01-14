const Discord = require('discord.js');

const ReminderCreate = require('./Reminder.create');
const ReminderList = require('./Reminder.list');
const ReminderDelete = require('./Reminder.delete');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Reminder system.')
        .setDMPermission(false)
        .addSubcommand(ReminderCreate.data)
        .addSubcommand(ReminderList.data)
        .addSubcommand(ReminderDelete.data),
    subCommands: [
        ReminderCreate,
        ReminderList,
        ReminderDelete
    ]
}