const Discord = require('discord.js');
const { addMember } = require('../../Functions/memberTracking');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     */
    async execute(member, client) {
        await addMember(await member.fetch());
    }
};