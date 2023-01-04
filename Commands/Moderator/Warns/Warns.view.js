const Discord = require('discord.js');
const moment = require('moment');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('view')
        .setDescription('View the logged warnings of a user.')
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

        const warnings = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'warning' }).sort({ time: -1 });
        if (warnings.length == 0) return EmbedGenerator.errorEmbed('No warnings found');

        const embeds = [];

        for (let i = 0; i < warnings.length; i += 10) {
            const warningsSlice = warnings.slice(i, i + 10);
            const embed = EmbedGenerator.basicEmbed()
                .setAuthor({ name: `${user.tag} | Warnings`, iconURL: user.displayAvatarURL() })
                .setDescription([
                    `Total Warnings: ${warnings.length}`,
                    `Latest Warning: <t:${moment(warnings[0].time).unix()}:f>`,
                    '',
                    ...warningsSlice.map((warning, index) => `**${i + index + 1}** • **${warning.reason}** • <@${warning.issuer}>`)
                ].join('\n'))

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds);
    }
}