const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('removelog')
        .setDescription('Removes a logged ban from a member of the discord.')
        .addUserOption((option) =>
            option
                .setName(`user`)
                .setDescription(`The user you'd like to remove a ban from.`)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('ban')
                .setDescription('The ban you\'d like to remove, alternatively "all" or "latest".')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        const ban = interaction.options.getString('ban', true);
        if (ban == 'all') {
            await Infractions.deleteMany({
                guild: interaction.guild.id,
                user: user.id,
                type: 'ban',
                active: false,
            });

            return EmbedGenerator.basicEmbed('All inactive bans removed');
        }

        const bans = await Infractions.find({
            guild: interaction.guild.id,
            user: user.id,
            type: 'ban',
        }).sort({ time: -1 });
        if (bans.length == 0)
            return { embeds: [EmbedGenerator.errorEmbed('No bans found')], ephemeral: true };

        if (ban == 'latest') {
            if (bans[0].active)
                return {
                    embeds: [EmbedGenerator.errorEmbed('Unable to remove an active ban')],
                    ephemeral: true,
                };
            await bans[0].remove();

            return EmbedGenerator.basicEmbed('Ban removed');
        } else {
            if (isNaN(+ban) || !bans[+ban - 1])
                return { embeds: [EmbedGenerator.errorEmbed('Ban not found')], ephemeral: true };
            if (bans[+ban - 1].active)
                return {
                    embeds: [EmbedGenerator.errorEmbed('Unable to remove an active ban')],
                    ephemeral: true,
                };

            await bans[+ban - 1].remove();

            return EmbedGenerator.basicEmbed('Ban removed');
        }
    },
};
