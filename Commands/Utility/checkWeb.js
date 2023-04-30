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
        )
        .addBooleanOption((option) =>
            option
                .setName('verbose')
                .setDescription('Whether to display detailed information about the website')
                .setRequired(false)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const url = interaction.options.getString('url');
        const verbose = interaction.options.getBoolean('verbose') || false;
        try {
            https
                .get(url, (response) => {
                    if (response.statusCode === 200) {
                        if (verbose) {
                            interaction.reply(
                                `${url} is up! Response code: ${response.statusCode}`
                            );
                        } else {
                            interaction.reply(`${url} is up!`);
                        }
                    } else {
                        if (verbose) {
                            interaction.reply(
                                `${url} is down! Response code: ${response.statusCode}`
                            );
                        } else {
                            interaction.reply(`${url} is down!`);
                        }
                    }
                })
                .on('error', (error) => {
                    console.error(error);
                    interaction.reply(`There was an error checking ${url}`);
                });
        } catch (error) {
            console.error(error);
            interaction.reply(`There was an error checking ${url}`);
        }
    },
};
