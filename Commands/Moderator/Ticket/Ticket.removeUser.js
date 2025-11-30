const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Tickets = require('../../../Schemas/Tickets');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('remove_user')
        .setDescription('Remove permission from a user to view a ticket.')
        .addUserOption((option) =>
            option.setName('user').setDescription('User to remove.').setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName('channel').setDescription('Ticket to remove the user from.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = await interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch({ user: user.id }).catch(() => null);
        /** @type {Discord.TextChannel} */ const channel =
            interaction.options.getChannel('channel') || interaction.channel;
        const ticket = await Tickets.findOne({ guild: interaction.guild.id, channel: channel.id });

        if (!ticket) return EmbedGenerator.errorEmbed('Ticket not found.');
        if (!ticket.active) return EmbedGenerator.errorEmbed('That ticket is not active.');
        if (ticket.user === user.id)
            return EmbedGenerator.errorEmbed('Unable to remove the ticket creator.');

        if (!member) return EmbedGenerator.errorEmbed('Member not found.');

        channel.permissionOverwrites
            .edit(member.id, { ViewChannel: false, SendMessages: false })
            .then(() => {
                interaction.reply({
                    embeds: [EmbedGenerator.basicEmbed('Member removed from ticket.')],
                });
            })
            .catch(() => {
                interaction.reply({ embeds: [EmbedGenerator.errorEmbed()] });
            });
    },
};
