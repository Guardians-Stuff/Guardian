const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('timeouts')
        .setDMPermission(false)
        .setDescription('View the timeouts of a user.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you\'d like to view.')
            .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        const timeouts = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'timeout' }).sort({ time: -1 });
        if (timeouts.length == 0) return EmbedGenerator.errorEmbed('No timeouts found');

        const embeds = [];

        for (let i = 0; i < timeouts.length; i += 10) {
            const timeoutsSlice = timeouts.slice(i, i + 10);
            const embed = EmbedGenerator.basicEmbed()
                .setAuthor({ name: `${user.tag} | Timeouts`, iconURL: user.displayAvatarURL() })
                .setDescription([
                    `Total Timeouts: ${timeouts.length}`,
                    `Latest Timeout: <t:${moment(timeouts[0].time).unix()}:f>`,
                    '',
                    ...timeoutsSlice.map((timeout, index) => `**${i + index + 1}** • ${ms(timeout.duration, { long: true })} • **${timeout.reason}** • <@${timeout.issuer}>`)
                ].join('\n'))

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds);
    }
}