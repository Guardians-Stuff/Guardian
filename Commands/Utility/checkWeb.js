const Discord = require(`discord.js`);
const https = require(`https`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('checkwebsite')
        .setDescription('Checks if a website is up.')
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('The URL of the website to check')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const url = interaction.options.getString('url');
        try {
            https.get(url, (response) => {
                if (response.statusCode === 200) {
                    interaction.reply(`${url} is up!`);
                } else {
                    interaction.reply(`${url} is down!`);
                }
            });
        } catch (error) {
            console.error(error);
            interaction.reply(`There was an error checking ${url}`);
        }
    },
};
