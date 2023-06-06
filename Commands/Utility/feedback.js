const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Send feedback to a certain channel.')
        .addStringOption((option) =>
            option.setName('feedback').setDescription('Your feedback.').setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('rating').setDescription('Your rating out of 5.').setRequired(true)
        ),
    async execute(interaction, client, dbGuild) {
        const feedbackChannel = client.channels.cache.get('1109627213759914005'); // Channel id of the feedback channel
        const feedback = interaction.options.getString('feedback');
        const rating = interaction.options.getInteger('rating');
        feedbackChannel.send(
            `New Feedback from ${interaction.user.tag}: ${feedback}\nRating: ${rating}/5`
        );
        interaction.reply('Feedback sent!');
    },
};
