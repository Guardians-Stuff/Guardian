const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('removelog')
        .setDescription('Removes a logged timeout from a member of the discord.')
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`The user you'd like to remove a timeout from.`)
            .setRequired(true)
        ).addStringOption(option => option
            .setName('timeout')
            .setDescription('The timeout you\'d like to remove, alternatively "all" or "latest".')
            .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        const timeout = interaction.options.getString('timeout', true);
        if (timeout == 'all') {
            await Infractions.deleteMany({ guild: interaction.guild.id, user: user.id, type: 'timeout' });

            return EmbedGenerator.basicEmbed('All timeouts removed');
        }

        const timeouts = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'timeout' }).sort({ time: -1 });
        if (timeouts.length == 0) return { embeds: [EmbedGenerator.errorEmbed('No timeouts found')], ephemeral: true };

        if (timeout == 'latest') {
            await timeouts[0].remove();

            return EmbedGenerator.basicEmbed('Timeout removed');
        } else {
            if (isNaN(+timeout) || !timeouts[+timeout - 1]) return { embeds: [EmbedGenerator.errorEmbed('Timeout not found')], ephemeral: true };

            await timeouts[+timeout - 1].remove();

            return EmbedGenerator.basicEmbed('Timeout removed')
        }

    }
}