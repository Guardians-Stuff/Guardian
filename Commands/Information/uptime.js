const Discord = require('discord.js');
const ms = require('ms');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('uptime')
        .setDMPermission(false)
        .setDescription('View the bots uptime.'),
    /**
     *
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    execute(interaction, client) {
        return {
            embeds: [
                EmbedGenerator.basicEmbed(
                    `The bot has been online for \`${ms(client.uptime, { long: true })}\``
                ).setAuthor({
                    name: `${client.user.tag} | Uptime`,
                    iconURL: client.user.displayAvatarURL(),
                }),
            ],
            ephemeral: true,
        };
    },
};
