const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Tickets = require('../../../Schemas/Tickets');
const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('unblock')
        .setDescription('Unblock a user from creating tickets.')
        .addUserOption((option) => option.setName('user').setDescription('User to unblock')),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        /** @type {Discord.TextChannel} */ let user = interaction.options.getUser('user');

        if (!user) {
            const ticket = await Tickets.findOne({
                guild: interaction.guild.id,
                channel: interaction.channel.id,
            });
            if (!ticket) return EmbedGenerator.errorEmbed('User not found.');

            user = await client.users.fetch(ticket.user).catch(() => null);
            if (!user) return EmbedGenerator.errorEmbed('User not found.');
        }

        const blocked = await Infractions.findOne({
            guild: interaction.guild.id,
            user: interaction.user.id,
            type: 'block',
            active: true,
        });
        if (!blocked)
            return EmbedGenerator.errorEmbed("That user isn't blocked from creating tickets.");

        await Infractions.updateMany(
            { guild: interaction.guild.id, user: interaction.user.id, type: 'block', active: true },
            { $set: { active: false } }
        );

        return EmbedGenerator.basicEmbed('User unblocked.');
    },
};
