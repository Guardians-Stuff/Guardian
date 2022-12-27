const Discord = require('discord.js');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('removetimeout')
        .setDescription('Removes a timeout from a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
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
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        /** @type {String} */ let timeout = interaction.options.getString('timeout', true);
        if(timeout == 'all'){
            await Infractions.deleteMany({ guild: interaction.guild.id, user: user.id, type: 'timeout' });

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('All timeouts removed').setTimestamp() ] });
        }
        
        const timeouts = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'timeout' }).sort({ time: -1 });
        if(timeouts.length == 0) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('No timeouts found') ], ephemeral: true });

        if(timeout == 'latest'){
            await timeouts[0].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Timeout removed') ] });
        }else{
            if(isNaN(+timeout)) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Timeout not found') ], ephemeral: true });
            if(!timeouts[+timeout - 1]) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Timeout removed').setTimestamp() ] });

            await timeouts[+timeout - 1].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Timeout removed').setTimestamp() ] });
        }
        
    }
}