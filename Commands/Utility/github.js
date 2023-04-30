const Discord = require(`discord.js`);
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('github')
        .setDescription('Check GitHub stats of a user.')
        .addStringOption((option) =>
            option
                .setName('username')
                .setDescription('The GitHub username to check')
                .setRequired(true)
        ),
    async execute(interaction, client, dbGuild) {
        const username = interaction.options.getString('username');
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const data = response.data;
        const message =
            `${username}'s GitHub Stats\n` +
            `Public Repositories: ${data.public_repos}\n` +
            `Followers: ${data.followers}\n` +
            `Following: ${data.following}\n` +
            `URL: https://github.com/${username}`;
        await interaction.reply({ content: message });
    },
};
