const Discord = require('discord.js');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('removekick')
        .setDescription('Removes a kick from a member of the discord.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`The user you'd like to remove a kick from.`)
            .setRequired(true)
        ).addStringOption(option => option
            .setName('kick')
            .setDescription('The kick you\'d like to remove, alternatively "all" or "latest".')
            .setRequired(true)
        ),
    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        /** @type {String} */ let kick = interaction.options.getString('kick', true);
        if(kick == 'all'){
            await Infractions.deleteMany({ guild: interaction.guild.id, user: user.id, type: 'kick' });

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('All kicks removed').setTimestamp() ] });
        }
        
        const kicks = await Infractions.find({ guild: interaction.guild.id, user: user.id, type: 'kick' }).sort({ time: -1 });
        if(kicks.length == 0) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('No kicks found') ], ephemeral: true });

        if(kick == 'latest'){
            await kicks[0].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Kick removed') ] });
        }else{
            if(isNaN(+kick)) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Kick not found') ], ephemeral: true });
            if(!kicks[+kick - 1]) return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Kick removed').setTimestamp() ] });

            await kicks[+kick - 1].remove();

            return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription('Kick removed').setTimestamp() ] });
        }
        
    }
}