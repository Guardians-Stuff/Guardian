const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Gives the server basic rules.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ADMINISTRATOR)
        .setDMPermission(false),

    async execute(interaction, client, dbGuild) {
        const rulesEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Server Rules')
            .setDescription('These are the rules for the server.')
            .addFields(
                { name: 'Rule 1', value: 'Be respectful to others.' },
                { name: 'Rule 2', value: 'No spamming or flooding the chat with messages.' },
                { name: 'Rule 3', value: 'No adult content or NSFW content.' },
                { name: 'Rule 4', value: 'No hate speech or discriminatory remarks.' },
                { name: 'Rule 5', value: 'No hacking, exploiting, or cheating.' },
                { name: 'Rule 6', value: 'No sharing of personal information.' },
                { name: 'Rule 7', value: 'No advertising or self-promotion.' },
                { name: 'Rule 8', value: 'No sharing of pirated or illegal content.' },
                { name: 'Rule 9', value: 'No excessive swearing or offensive language.' },
                {
                    name: 'Rule 10',
                    value: "Follow Discord's Terms of Service and Community Guidelines.",
                }
            )
            .setTimestamp();
        //.setFooter('Server Rules');

        await interaction.reply({ embeds: [rulesEmbed] });
    },
};
