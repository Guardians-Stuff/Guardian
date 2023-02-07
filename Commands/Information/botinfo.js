const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Receive information about the bot"),
    async execute(interaction) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);
        //const developerArray = [`<@${1049140383122194452}>`, `<@${410862653419028481}>`];
        const replyEmbed = new EmbedBuilder()
            .addFields(
                {
                    name: `Name`,
                    value: `Guardian`,
                    inline: true,
                },
                {
                    name: `ID`,
                    value: `1053736067129421884`,
                    inline: true,
                },
                {
                    name: `Developers`,
                    value: `Maxxie & Nyxa`,
                    inline: true,
                },
                {
                    name: "Total Guilds",
                    value: `\`${interaction.client.guilds.cache.size}\``,
                    inline: true,
                },
                {
                    name: "Total Users",
                    value: `\`${interaction.client.users.cache.size}\``,
                    inline: true,
                },
                {
                    name: "Uptime",
                    value: `\`${days}d:${hours}h:${minutes}m:${seconds}s\``,
                    inline: true,
                },
                {
                    name: `Dependency versions`,
                    value: `NodeJS: \`v18.12.0\`\nDiscord.JS: \`14.7.0\`\nMongoose: \`6.7.0\``,
                    inline: true,
                },
                {
                    name: `Links`,
                    value:
                        "[**Github**](https://github.com/Guardians-Stuff/Guardian)\n[**Dashboard**](https://guardianbot.space)\n[**Discord**](https://discord.gg/BuBex4PxJj)",
                    inline: true,
                }
            )
            .setColor("Blue")
            .setTimestamp();
        interaction.reply({
            embeds: [replyEmbed],
        });
    },
};
