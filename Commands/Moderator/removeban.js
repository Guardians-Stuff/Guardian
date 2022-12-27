const Discord = require('discord.js');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('removeban')
        .setDescription('Removes a ban from a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`The user you'd like to remove a ban from.`)
            .setRequired(true)
        ).addStringOption(option => option
            .setName('ban')
            .setDescription('The ban you\'d like to remove, alternatively "all" or "latest".')
            .setRequired(true)
        ),
    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        /** @type {String} */ let ban = interaction.options.getString('ban', true);
        if(ban == 'all'){
            await Infractions.deleteMany({ guild: interaction.guild.id, user: user.id, type: 'ban', active: false });

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('All inactive bans removed').setTimestamp() ] });
        }
        
        const bans = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'ban' }).sort({ time: -1 });
        if(bans.length == 0) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('No bans found') ], ephemeral: true });

        if(ban == 'latest'){
            if(bans[0].active) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Unable to remove an active ban') ], ephemeral: true });
            await bans[0].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Ban removed') ] });
        }else{
            if(isNaN(+ban)) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Ban not found') ], ephemeral: true });
            if(!bans[+ban - 1]) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Ban removed').setTimestamp() ] });
            if(bans[+ban - 1].active) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Unable to remove an active ban') ], ephemeral: true });

            await bans[+ban - 1].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Ban removed').setTimestamp() ] });
        }
        
    }
}