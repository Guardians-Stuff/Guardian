const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');

const Infractions = require('../../Schemas/Infractions');
const { createPages } = require('../../Functions/createPages');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('bans')
        .setDescription('View the bans of a user.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
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

        const bans = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'ban' }).sort({ time: -1 });
        if(bans.length == 0) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('No bans found') ] })

        const embeds = [];

        for(let i = 0; i < bans.length; i += 10){
            const bansSlice = bans.slice(i, i + 10);
            const embed = new Discord.EmbedBuilder()
                .setColor('#fff176')
                .setAuthor({ name: `${user.tag} | Bans`, iconURL: user.displayAvatarURL() })
                .setDescription([
                    `Total Bans: ${bans.length}`,
                    `Latest Ban: <t:${moment(bans[0].time).unix()}:f>`,
                    '',
                    ...bansSlice.map((ban, index) => `**${i + index + 1}** • ${ban.permanent ? 'Permenant' : ms(ban.duration, { long: true }) } • **${ban.reason}** • <@${ban.issuer}>`)
                ].join('\n'))

            embeds.push(embed);
        }

        await createPages(interaction, embeds);
    }
}