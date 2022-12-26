const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Allows members to send messages in the channel.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unlocking the channel.')
        ),
    /**
     * 
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client){
        /** @type {String} */ const reason = interaction.options.getString('reason') || 'Unspecified reason.';
        /** @type {Discord.TextChannel} */ const channel = interaction.channel;

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true }).then(() => {
            interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`This channel has been unlocked | ${reason}`) ] });
        }).catch(() => {
            interaction.reply({ content: 'There was an error.', ephemeral: true });
        });
    }
}