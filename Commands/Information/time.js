const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('time').setDescription('the current time and date'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setThumbnail(
                'https://cdn.discordapp.com/attachments/1080219392337522718/1081227919256457246/largepurple.png'
            )
            .setColor('Purple')
            .setAuthor({ name: `⌚ Time Tool` })
            .setFooter({ text: `⌚ Fetched Date & Time` })
            .setTitle('> Current Date/Time')
            .addFields(
                {
                    name: '• Time:',
                    value: `> <t:${Math.floor(Date.now() / 1000)}:T>`,
                    inline: true,
                },
                { name: '• Date:', value: `> <t:${Math.floor(Date.now() / 1000)}:D>`, inline: true }
            );

        return interaction.reply({
            embeds: [embed],
        });
    },
};
