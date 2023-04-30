const Discord = require(`discord.js`);
const weather = require(`weather-js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('weather')
        .setDescription('Check the weather of a state or country.')
        .addStringOption((option) =>
            option
                .setName('location')
                .setDescription('The location to check the weather for.')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const location = interaction.options.getString('location');
        weather.find({ search: location, degreeType: 'F' }, function (err, result) {
            if (err) {
                console.log(err);
                interaction.reply('There was an error while fetching the weather data.');
                return;
            }
            if (!result || result.length === 0) {
                interaction.reply(`No weather data found for ${location}.`);
                return;
            }
            const current = result[0].current;
            const locationName = result[0].location.name;
            const temperature = current.temperature;
            const feelsLike = current.feelslike;
            const description = current.skytext;
            const windSpeed = current.winddisplay;
            const humidity = current.humidity;
            const weatherMessage =
                `**Weather for ${locationName}**\n\n` +
                `Description: ${description}\n` +
                `Temperature: ${temperature}°F\n` +
                `Feels Like: ${feelsLike}°F\n` +
                `Wind Speed: ${windSpeed}\n` +
                `Humidity: ${humidity}%\n`;
            interaction.reply(weatherMessage);
        });
    },
};
