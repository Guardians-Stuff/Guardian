const Discord = require('discord.js');
const { addGuild } = require('../../Functions/memberTracking');

module.exports = {
    name: 'guildCreate',
    /**
     * @param {Discord.Guild} guild
     * @param {Discord.Client} client
     */
    async execute(guild, client) {
        await addGuild(await guild.fetch());
    }
};