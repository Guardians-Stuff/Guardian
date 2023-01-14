const Discord = require('discord.js');
const Moment = require('moment');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Reminders = require('../../../Schemas/Reminders');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('list')
        .setDescription('View your reminders.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const reminders = await Reminders.find({ user: interaction.user.id }).sort({ expires: 1 });
        if (reminders.length == 0) return { embeds: [ EmbedGenerator.errorEmbed('No reminders found.') ], ephemeral: true };

        const embeds = [];

        for (let i = 0; i < reminders.length; i += 10) {
            const remindersSlice = reminders.slice(i, i + 10);
            const embed = EmbedGenerator.basicEmbed()
                .setAuthor({ name: 'Guardian Reminders', iconURL: client.user.displayAvatarURL() })
                .setDescription(remindersSlice.map((reminder, index) => {
                    const ends = Moment(reminder.expires);
                    return `**${i + index + 1}** • <t:${ends.unix()}:R>(<t:${ends.unix()}:f>) • ${reminder.reminder}`;
                }
            ).join('\n'));

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds, true);
    }
}