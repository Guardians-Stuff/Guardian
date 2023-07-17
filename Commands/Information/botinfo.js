const Discord = require('discord.js');
const Mongoose = require('mongoose');

const Guilds = require('../../Schemas/Guilds');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Receive information about the bot')
        .setDMPermission(false),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const replyEmbed = new Discord.EmbedBuilder()
            .addFields(
                {
                    name: `<:blurple_discord_at:1115466237263237230> Name`,
                    value: `Guardian`,
                    inline: true,
                },
                {
                    name: `<:blurple_invite:1115466603325313034> ID`,
                    value: `1053736067129421884`,
                    inline: true,
                },
                {
                    name: `<:blurple_employee:1115467009791115285> Developers`,
                    value: `Maxxie`,
                    inline: true,
                },
                {
                    name: '<:blurple_bot:1115465243649380452> Total Guilds',
                    value: `\`${interaction.client.guilds.cache.size}\``,
                    inline: true,
                },
                {
                    name: '<:blurple_members:1115465488227635272> Total Users',
                    value: `\`${
                        (
                            await Guilds.aggregate([
                                { $unwind: { path: '$members' } },
                                { $group: { _id: null, totalMembers: { $sum: 1 } } },
                            ])
                        )[0].totalMembers
                    }\``,
                    inline: true,
                },
                {
                    name: '<:blurple_chat:1115465656549265509> Uptime',
                    value: `\`${days}d:${hours}h:${minutes}m:${seconds}s\``,
                    inline: true,
                },
                {
                    name: `Dependency versions`,
                    value: `<:nodejs:1115464281165668362> NodeJS: \`${process.version}\`\n<:discord_js:1115464430646468628> Discord.JS: \`${Discord.version}\`\n<:blurple_lock:1115464901377392671> Mongoose: \`${Mongoose.version}\``,
                    inline: true,
                },
                {
                    name: `Links`,
                    value: '<:github:1109625282752688189> [**Github**](https://github.com/Guardians-Stuff/Guardian)\n<:blurple_link:1115463946565079040> [**Invite**](https://discord.com/oauth2/authorize?client_id=1130480504097996832&scope=bot)',
                    inline: true,
                }
            )
            .setColor('Blue')
            .setTimestamp();

        return replyEmbed;
    },
};
