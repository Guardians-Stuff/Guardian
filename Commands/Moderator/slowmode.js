const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slowmode of the channel.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
        .addStringOption(option => option
            .setName('duration')
            .setDescription('Duration between sending messages in the channel.')
            .setRequired(true)
        ).addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for setting the slowmode.')
        ),
    /**
     * 
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client){
        /** @type {String} */ const duration = interaction.options.getString('duration', true);
        const durationSeconds = Math.floor(ms(duration) / 1000);
        /** @type {String} */ const reason = interaction.options.getString('reason') || 'Unspecified reason.';
        /** @type {Discord.TextChannel} */ const channel = interaction.channel;
    
        if(isNaN(durationSeconds)) return interaction.reply({ content: 'Invalid duration.', ephemeral: true });
        if(durationSeconds < 0) return interaction.reply({ content: 'Duration must not be less than 0 seconds.', ephemeral: true });
        if(durationSeconds > 21600) return interaction.reply({ content: 'Duration must not be greater than 6 hours.', ephemeral: true });

        channel.setRateLimitPerUser(durationSeconds, reason).then(() => {
            const durationString = durationSeconds == 0 ? 'disabled' : ms(ms(duration), { long: true });
            interaction.reply({ embeds: [ new Discord.EmbedBuilder().setColor('#fff176').setDescription(`The slowmode for this chnanel is now ${durationString} | ${reason}`) ] });
        }).catch(() => {
            interaction.reply({ content: 'There was an error.', ephemeral: true });
        });
    }
}