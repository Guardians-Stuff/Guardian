const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('status')
        .setDescription('Check if the bot is online or not.'),
    async execute(interaction, client, dbGuild) {
        await interaction.reply(client.ws.status === 0 ? 'Bot is online!' : 'Bot is offline!');
    },
};
