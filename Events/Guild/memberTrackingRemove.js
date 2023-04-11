const Discord = require('discord.js');
const { removeMember } = require('../../Functions/memberTracking');

module.exports = {
    name: 'guildMemberRemove',
    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     */
    async execute(member, client) {
        await removeMember(member);
    },
};
