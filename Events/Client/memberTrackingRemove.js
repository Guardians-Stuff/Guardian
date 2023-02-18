const Discord = require('discord.js');
const { removeGuild } = require('../../Functions/memberTracking');

module.exports = {
    name: 'guildDelete',
    /**
     * @param {Discord.Guild} guild
     * @param {Discord.Client} client
     */
    async execute(guild, client) {
        await removeGuild(guild);
    }
};