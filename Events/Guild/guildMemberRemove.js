const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { GuildsManager } = require('../../Classes/GuildsManager');

module.exports = {
    name: 'guildMemberRemove',
    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     */
    async execute(member, client) {
        const guild = await GuildsManager.fetch(member.guild.id);
        if (!guild) return;

        if (guild.logs.enabled) {
            const logChannel = await member.guild.channels.fetch(guild.logs.basic);
            if (!logChannel || !(logChannel instanceof Discord.TextChannel)) return;

            const accountCreation = parseInt(member.user.createdTimestamp / 1000);

            logChannel.send({
                embeds: [
                    EmbedGenerator.basicEmbed(
                        [
                            `• User: ${member.user}`,
                            `• Account Type: ${member.user.bot ? 'Bot' : 'User'}`,
                            `• Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
                        ].join('\n')
                    )
                        .setAuthor({
                            name: `${member.user.tag} | ${member.id}`,
                            iconURL: member.displayAvatarURL({ dynamic: true }),
                        })
                        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                        .setFooter({ text: 'Left' })
                        .setTimestamp(),
                ],
            });
        }
    },
};
