const Discord = require('discord.js');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('removewarn')
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
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        /** @type {String} */ let warning = interaction.options.getString('warning', true);
        if(warning == 'all'){
            await Infractions.deleteMany({ guild: interaction.guild.id, user: user.id, type: 'warning' });

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('All warnings removed').setTimestamp() ] });
        }
        
        const warnings = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'warning' }).sort({ time: -1 });
        if(warnings.length == 0) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('No warnings found') ], ephemeral: true });

        if(warning == 'latest'){
            await warnings[0].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Warning removed') ] });
        }else{
            if(isNaN(+warning)) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Warning not found') ], ephemeral: true });
            if(!warnings[+warning - 1]) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Warning removed').setTimestamp() ] });

            await warnings[+warning - 1].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Warning removed').setTimestamp() ] });
        }
        
    }
}