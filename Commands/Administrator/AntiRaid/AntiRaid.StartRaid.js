const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('start_raid')
        .setDescription('Manually start the anti-raid protection system.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        if(dbGuild.antiraid.raid) return EmbedGenerator.errorEmbed(':x: A raid is already ongoing!')

        dbGuild.antiraid.raid = true;
        if(dbGuild.antiraid.lockdown.enabled){
            dbGuild.antiraid.lockdown.active = true;

            // execute lockdown
        }

        return EmbedGenerator.basicEmbed(`🔒 | Raid mode has been enabled!${dbGuild.antiraid.lockdown.enabled ? '\n🔒 | This server has entered lockdown mode!' : ''}`);
    }
}