const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { GuildsManager } = require('../../Classes/GuildsManager');

const Infractions = require('../../Schemas/Infractions');
const Tickets = require('../../Schemas/Tickets');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.Interaction} interaction
     */
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'open-ticket') return;

        const guild = await GuildsManager.fetch(interaction.guild.id);
        if (!guild.tickets.enabled)
            return interaction.reply({
                embeds: [
                    EmbedGenerator.basicEmbed("This guild doesn't have the ticket system enabled."),
                ],
                ephemeral: true,
            });

        const blocked = await Infractions.findOne({
            guild: interaction.guild.id,
            user: interaction.user.id,
            type: 'block',
            active: true,
        });
        if (blocked)
            return interaction.reply({
                embeds: [EmbedGenerator.errorEmbed('You are blocked from creating tickets.')],
                ephemeral: true,
            });

        const ticket = await Tickets.findOne({
            guild: interaction.guild.id,
            user: interaction.user.id,
            active: true,
        });
        if (ticket)
            return interaction.reply({
                embeds: [EmbedGenerator.errorEmbed('You already have an open ticket.')],
                ephemeral: true,
            });

        interaction.guild.channels
            .create({
                name: `ticket-${interaction.user.username}`,
                parent: guild.tickets.category,
                type: Discord.ChannelType.GuildText,
            })
            .then(async (channel) => {
                await channel.lockPermissions().catch(() => null);
                await channel.permissionOverwrites
                    .edit(interaction.user.id, { ViewChannel: true, SendMessages: true })
                    .catch(() => null);

                const previousTickets = await Tickets.find({
                    guild: interaction.guild.id,
                    user: interaction.user.id,
                }).sort({ _id: -1 });

                await Tickets.create({
                    guild: interaction.guild.id,
                    user: interaction.user.id,
                    channel: channel.id,
                });

                channel
                    .send({
                        content: `<@${interaction.user.id}>`,
                        embeds: [
                            EmbedGenerator.basicEmbed()
                                .addFields({
                                    name: `Previous Tickets (${
                                        previousTickets.slice(0, 5).length
                                    }/${previousTickets.length})`,
                                    value:
                                        previousTickets.length === 0
                                            ? 'No previous tickets.'
                                            : previousTickets
                                                  .slice(0, 5)
                                                  .map(
                                                      (ticket) =>
                                                          `[${ticket._id.toString()}](${
                                                              process.env.LIVE === 'true'
                                                                  ? 'https://guardianbot.space'
                                                                  : 'http://localhost:3001'
                                                          }/guilds/${
                                                              ticket.guild
                                                          }/tickets/${ticket._id.toString()})`
                                                  )
                                                  .join('\n'),
                                })
                                .setAuthor({
                                    name: `Ticket | ${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setTimestamp(),
                        ],
                    })
                    .catch(() => null);

                interaction.reply({
                    embeds: [EmbedGenerator.basicEmbed(`Ticket created, <#${channel.id}>`)],
                    ephemeral: true,
                });
            })
            .catch(() => {
                interaction.reply({ embeds: [EmbedGenerator.errorEmbed()], ephemeral: true });
            });
    },
};
