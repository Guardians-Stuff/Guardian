const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('status')
        .setDescription('Check if the bot is online or not.'),
    async execute(interaction, client, dbGuild) {
        await interaction.reply(client.ws.status === 0 ? '<:blurple_check:1115777129536294932> Bot is online!' : '<:blurple_cross:1115777101925199912> Bot is offline!');
    },
};
