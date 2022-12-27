const Discord = require('discord.js');
const moment = require('moment');
const { createPages } = require('../../Functions/createPages');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('kicks')
        .setDescription('View the kicks of a user.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.KickMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you\'d like to view.')
            .setRequired(true)
        ),
    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client){
        const user = interaction.options.getUser('user', true);

        const kicks = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'kick' }).sort({ time: -1 });
        if(kicks.length == 0) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('No kicks found') ] })

        const embeds = [];

        for(let i = 0; i < kicks.length; i += 10){
            const kicksSlice = kicks.slice(i, i + 10);
            const embed = new Discord.EmbedBuilder()
                .setColor('#fff176')
                .setAuthor({ name: `${user.tag} | Kicks`, iconURL: user.displayAvatarURL() })
                .setDescription([
                    `Total Kicks: ${kicks.length}`,
                    `Latest Kick: <t:${moment(kicks[0].time).unix()}:f>`,
                    '',
                    ...kicksSlice.map((kick, index) => `**${i + index + 1}** • **${kick.reason}** • <@${kick.issuer}>`)
                ].join('\n'))

            embeds.push(embed);
        }

        await createPages(interaction, embeds);
    }
}