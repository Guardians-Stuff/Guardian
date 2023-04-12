const Discord = require('discord.js');
const Moment = require('moment');
const ms = require('ms');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Reminders = require('../../../Schemas/Reminders');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('create')
        .setDescription('Create a reminder.')
        .addStringOption((option) =>
            option
                .setName('reminder')
                .setDescription('Reminder to send you.')
                .setRequired(true)
                .setMaxLength(400)
        )
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('How long until you should be reminded.')
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName('repeating')
                .setDescription('Whether this reminder should repeat until deleted.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const reminder = interaction.options.getString('reminder', true);
        const duration = interaction.options.getString('duration', true);
        const repeating = interaction.options.getBoolean('repeating') || false;

        const durationMs = ms(duration);
        if (!durationMs)
            return { embeds: [EmbedGenerator.errorEmbed('Invalid duration.')], ephemeral: true };
        const ends = Moment().add(durationMs);

        await client.expiringDocumentsManager.reminders.addNewDocument(
            await Reminders.create({
                user: interaction.user.id,
                reminder: reminder,
                repeating: repeating,
                duration: durationMs,
            })
        );

        return {
            embeds: [
                EmbedGenerator.basicEmbed(
                    `Reminder created.\nYou will be reminded in <t:${ends.unix()}:R>(<t:${ends.unix()}:f>)`
                ),
            ],
            ephemeral: true,
        };
    },
};
