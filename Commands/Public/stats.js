const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Shows the bot's stats"),
    execute(interaction) {
        // d:hh:mm:ss
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .addFields([
                { name: "🏓 Ping", value: `${interaction.client.ws.ping}`, inline: true },
                { name: "🕒 Uptime", value: `${days}d:${hours}h:${minutes}m:${seconds}s`, inline: true },
                { name: "📡 Memory Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: "📡 CPU Usage", value: `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: "🌍 Servers", value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: "👥 Users", value: `${interaction.client.users.cache.size}`, inline: true },
            ])
        interaction.reply({ embeds: [embed] });

    },
};
