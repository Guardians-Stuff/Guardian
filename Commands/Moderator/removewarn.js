const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('removewarn')
        .setDMPermission(false)
        .setDescription('Removes a warning from a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`The user you'd like to remove a warning from.`)
            .setRequired(true)
        ).addStringOption(option => option
            .setName('warning')
            .setDescription('The warning you\'d like to remove, alternatively "all" or "latest".')
            .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        const warning = interaction.options.getString('warning', true);
        if (warning == 'all') {
            await Infractions.deleteMany({ guild: interaction.guild.id, user: user.id, type: 'warning' });

            return EmbedGenerator.basicEmbed('All warnings removed');
        }

        const warnings = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'warning' }).sort({ time: -1 });
        if (warnings.length == 0) return { embeds: [EmbedGenerator.errorEmbed('No warnings found')], ephemeral: true };

        if (warning == 'latest') {
            await warnings[0].remove();

            return EmbedGenerator.basicEmbed('Warning removed');
        } else {
            if (isNaN(+warning) || !warnings[+warning - 1]) return { embeds: [EmbedGenerator.errorEmbed('Warning not found')], ephemeral: true };

            await warnings[+warning - 1].remove();

            return EmbedGenerator.basicEmbed('Warning removed');
        }

    }
}