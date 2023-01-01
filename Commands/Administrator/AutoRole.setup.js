const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('setup')
        .setDescription('Configure the auto-role system.')
        .addRoleOption(option => option
            .setName('member')
            .setDescription('Select the role given to new members.')
            .setRequired(true)
        ).addRoleOption(option => option
            .setName('bot')
            .setDescription('Select the role given to new bots.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const memberRole = interaction.options.getRole('member', true);
        const botRole = interaction.options.getRole('bot');

        dbGuild.autorole.enabled = true;
        dbGuild.autorole.member = memberRole.id;
        dbGuild.autorole.bot = botRole?.id;

        return EmbedGenerator.basicEmbed([
            '🔒 | The Auto-Role system has been enabled!',
            '',
            `• Member Auto-Role Updated: <@&${memberRole.id}>`,
            `• Bot Auto-Role Updated: ${botRole ? `<@&${botRole.id}>` : 'Not Specified.'}`,
        ].join("\n"));
    }
}