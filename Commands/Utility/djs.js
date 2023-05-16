const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('docs')
        .setDescription('Search the Discord.js documentation.')
        .addStringOption((option) =>
            option.setName('query').setDescription('The search query.').setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const searchUrl = `https://discord.js.org/#/docs/main/stable/search?q=${encodeURIComponent(
            query
        )}`;
        await interaction.reply(`Here is the search result for "${query}": ${searchUrl}`);
    },
};
