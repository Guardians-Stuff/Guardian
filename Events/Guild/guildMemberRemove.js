const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    name: 'guildMemberRemove',
    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     */
    async execute(member, client) {
        const guildConfig = client.guildConfig.get(member.guild.id)
        if(!guildConfig) return;

        const logChannel = await member.guild.channels.fetch(guildConfig.logs.basic);
        if(!logChannel) return;

        const accountCreation = parseInt(member.user.createdTimestamp / 1000);

        logChannel.send({ embeds: [
            EmbedGenerator.basicEmbed([
                `- User: ${member.user}`,
                `- Account Type: ${member.user.bot ? 'Bot' : 'User'}`,
                `- Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
            ].join("\n"))
            .setAuthor({ name: `${member.user.tag} | ${member.id}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
            .setFooter({ text: 'Left' })
            .setTimestamp()
        ] });
    }
}