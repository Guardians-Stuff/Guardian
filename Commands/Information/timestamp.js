const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timestamp')
        .setDescription('Generate a custom date or timestamp for Discord.')
        .addStringOption(option => 
            option.setName('date')
                .setDescription('Enter the date in the format "MM/DD/YYYY"')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('time')
                .setDescription('Enter the time in the format "HH:MM:SS"')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('format')
                .setDescription('Enter the format for the timestamp.')
                .setRequired(true)
                .addChoices(
                    { name: 'Monday, January 2, 2023 12:00 AM', value: 'F' },
                    { name: 'January 2, 2023 12:00 AM', value: 'f' },
                    { name: 'January 2, 2023', value: 'D' },
                    { name: '01/02/2023', value: 'd' },
                    { name: '- months ago', value: 'R' },
                )),
    async execute(interaction) {
        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const format = interaction.options.getString('format');

        const dateResult = new Date(`${date} ${time}`).getTime() / 1000

        await interaction.reply("<t:" + dateResult + ":" + format + ">" + ` - \`<t:${dateResult}:${format}>\``);
    },
};