const Discord = require('discord.js');

const ReactionRoles = require('../../Schemas/ReactionRoles');

module.exports = {
    name: 'messageReactionRemove',
    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User} user
     * @param {Discord.Client} client
     */
    async execute(reaction, user, client) {
        const reactionRole = await ReactionRoles.findOne({ guild: reaction.message.guild.id, message: reaction.message.id });
        if(reactionRole){
            const member = await reaction.message.guild.members.fetch({ user: user }).catch(() => null);
            if(!member) return;

            const role = await reaction.message.guild.roles.fetch(reactionRole.roles[[ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ].indexOf(reaction.emoji.name)]).catch(() => null);
            if(!role || !(role instanceof Discord.Role)) return;

            await member.roles.remove(role).catch(() => null);
        }
    }
}