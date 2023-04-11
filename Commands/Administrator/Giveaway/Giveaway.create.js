const Discord = require('discord.js');
const Moment = require('moment');
const ms = require('ms');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Giveaways = require('../../../Schemas/Giveaways');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('create')
        .setDescription('Create a giveaway.')
        .addStringOption((option) =>
            option
                .setName('prize')
                .setDescription('Prize to giveaway(will be used in the embed title)')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('winners')
                .setDescription('Amount of winners')
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('How long the giveaway should go on for')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('description').setDescription('Description to be used in the embed')
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('Alternative channel to send the embed in')
                .addChannelTypes(Discord.ChannelType.GuildText)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const prize = interaction.options.getString('prize', true);
        const description = interaction.options.getString('description');
        const winners = interaction.options.getNumber('winners', true);
        const duration = interaction.options.getString('duration', true);
        /** @type {Discord.TextChannel} */ const channel =
            interaction.options.getChannel('channel') || interaction.channel;

        const durationMs = ms(duration);
        if (!durationMs)
            return { embeds: [EmbedGenerator.errorEmbed('Invalid duration.')], ephemeral: true };
        const ends = Moment().add(durationMs);

        const sent = await channel.send({
            embeds: [
                EmbedGenerator.basicEmbed(
                    [
                        description ? description : null,
                        description ? '' : null,
                        `Winners: **${winners}**, Entries: **0**`,
                        `Status: Ongoing, ends in <t:${ends.unix()}:R>(<t:${ends.unix()}:f>)`,
                    ]
                        .filter((text) => text !== null)
                        .join('\n')
                )
                    .setTitle(`${prize} | Giveaway`)
                    .setFooter({
                        text: `Hosted by | ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                    .setTimestamp(),
            ],
            components: [
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('giveaway')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setLabel('Join')
                ),
            ],
            fetchReply: true,
        });

        await client.expiringDocumentsManager.giveaways.addNewDocument(
            await Giveaways.create({
                giveaway: sent.id,
                guild: interaction.guild.id,
                channel: channel.id,
                winners: winners,
                description: description,
                duration: durationMs,
            })
        );

        return {
            embeds: [EmbedGenerator.basicEmbed(`Giveaway created, ID: ${sent.id}`)],
            ephemeral: true,
        };
    },
};
