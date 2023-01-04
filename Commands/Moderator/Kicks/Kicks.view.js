const Discord = require('discord.js');
const moment = require('moment');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('view')
        .setDescription('View the logged kicks of a user.')
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

        const kicks = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'kick' }).sort({ time: -1 });
        if (kicks.length == 0) return EmbedGenerator.errorEmbed('No kicks found');

        const embeds = [];

        for (let i = 0; i < kicks.length; i += 10) {
            const kicksSlice = kicks.slice(i, i + 10);
            const embed = EmbedGenerator.basicEmbed([
                `Total Kicks: ${kicks.length}`,
                `Latest Kick: <t:${moment(kicks[0].time).unix()}:f>`,
                '',
                ...kicksSlice.map((kick, index) => `**${i + index + 1}** • **${kick.reason}** • <@${kick.issuer}>`)
            ].join('\n'))
                .setAuthor({ name: `${user.tag} | Kicks`, iconURL: user.displayAvatarURL() })

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds);
    }
}