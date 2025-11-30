const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Reminders = require('../../../Schemas/Reminders');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('delete')
        .setDescription('Delete a reminder.')
        .addStringOption((option) =>
            option
                .setName('reminder')
                .setDescription('The reminder you\'d like to remove, alternatively "all".')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const reminder = interaction.options.getString('reminder', true);

        if (reminder === 'all') {
            await Reminders.deleteMany({ user: interaction.user.id });

            return {
                embeds: [EmbedGenerator.basicEmbed('All reminders deleted.')],
                ephemeral: true,
            };
        }

        const reminders = await Reminders.find({ user: interaction.user.id }).sort({ expires: 1 });
        if (reminders.length === 0)
            return { embeds: [EmbedGenerator.errorEmbed('No reminders found.')], ephemeral: true };

        if (isNaN(+reminder) || !reminders[+reminder - 1])
            return { embeds: [EmbedGenerator.errorEmbed('Reminder not found.')], ephemeral: true };

        await reminders[+reminder - 1].remove();

        return { embeds: [EmbedGenerator.basicEmbed('Reminder deleted.')], ephemeral: true };
    },
};
