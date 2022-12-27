const Discord = require('discord.js');
const moment = require('moment');


module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     */
    async execute(member, client) {
        const guildConfig = client.guildConfig.get(member.guild.id)
        if (!guildConfig) return

        const guildRoles = await member.guild.roles.fetch();
        let assignedRole = member.user.bot ? guildRoles.get(guildConfig.autorole.bot) : guildRoles.get(guildConfig.autorole.member);
        if (!assignedRole){
            assignedRole = 'Not configured.';
        }else{
            await member.roles.add(assignedRole).catch(() => assignedRole = 'Failed due to higher role hierarchy.');
        }

        const logChannel = await member.guild.channels.fetch(guildConfig.logs.basic);
        if(!logChannel) return;

        let color = '#74e21e';
        let risk = 'Fairly Safe';

        const accountCreation = parseInt(member.user.createdTimestamp / 1000);
        const joiningTime = parseInt(member.joinedAt / 1000);

        const monthsAgo = moment().subtract(2, 'months').unix();
        const weeksAgo = moment().subtract(2, 'weeks').unix();
        const daysAgo = moment().subtract(2, 'days').unix();

        if(accountCreation >= monthsAgo) {
            color = "#e2bb1e"
            risk = "Medium"
        }
        
        if(accountCreation >= weeksAgo) {
            color = "#e24d1e"
            risk = "High"
        }
        
        if(accountCreation >= daysAgo) {
            color = "#e21e11"
            risk = "Extreme"
        }

        const response = {
            embeds: [
                new Discord.EmbedBuilder()
                    .setAuthor({ name: `${member.user.tag} | ${member.id}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setColor(color)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .setDescription([
                        `- User: ${member.user}`,
                        `- Account Type: ${member.user.bot ? "Bot" : "User"}`,
                        `- Role Assigned: ${assignedRole}`,
                        `- Risk Level: ${risk}\n`,
                        `- Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
                        `- Account Joined: <t:${joiningTime}:D> | <t:${joiningTime}:R>`,
                    ].join("\n"))
                    .setFooter({ text: "Joined" })
                    .setTimestamp()
            ],
            components: []
        };

        if(risk == 'High' || risk == 'Extreme') response.components = [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`MemberLogging-Kick-${member.id}`)
                    .setLabel('Kick')
                    .setStyle(Discord.ButtonStyle.Danger),
                new Discord.ButtonBuilder()
                    .setCustomId(`MemberLogging-Ban-${member.id}`)
                    .setLabel('Ban')
                    .setStyle(Discord.ButtonStyle.Danger)
            )
        ];

        logChannel.send(response);
    }
}