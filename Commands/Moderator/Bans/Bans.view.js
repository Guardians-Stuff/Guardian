const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('view')
        .setDescription('View the logged bans of a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription("The user you'd like to view.").setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        const bans = await Infractions.find({
            guild: interaction.guild.id,
            user: user.id,
            type: 'ban',
        }).sort({ time: -1 });
        if (bans.length == 0) return EmbedGenerator.errorEmbed('No bans found.');

        const embeds = [];

        for (let i = 0; i < bans.length; i += 10) {
            const bansSlice = bans.slice(i, i + 10);
            const embed = EmbedGenerator.basicEmbed(
                [
                    `Total Bans: ${bans.length}`,
                    `Latest Ban: <t:${moment(bans[0].time).unix()}:f>`,
                    '',
                    ...bansSlice.map(
                        (ban, index) =>
                            `**${i + index + 1}** • ${
                                ban.permanent ? 'Permenant' : ms(ban.duration, { long: true })
                            } • **${ban.reason}** • <@${ban.issuer}>`
                    ),
                ].join('\n')
            ).setAuthor({ name: `${user.tag} | Bans`, iconURL: user.displayAvatarURL() });

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds);
    },
};
