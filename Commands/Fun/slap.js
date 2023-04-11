const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone.')
        .setDMPermission(false)
        .addUserOption((option) => option.setName('member').setDescription('Member to slap')),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const member = interaction.options.getUser('member', true);

        return {
            content: `👏🔥 | <@${member.id}> you've been slapped by <@${interaction.user.id}>!`,
        };
    },
};
