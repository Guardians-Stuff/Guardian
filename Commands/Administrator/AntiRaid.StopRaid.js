const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('stop_raid')
        .setDescription('Stop the anti-raid protection system if triggered.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        if(!dbGuild.antiraid.raid) return EmbedGenerator.errorEmbed(':x: There is currently no ongoing raid!')

        dbGuild.antiraid.raid = false;
        if(dbGuild.antiraid.lockdown.enabled){
            dbGuild.antiraid.lockdown.active = false;

            // un-execute lockdown
        }

        return EmbedGenerator.basicEmbed(`🔓 | Raid mode has been disabled!${dbGuild.antiraid.lockdown.enabled ? '\n🔓 | This server has left lockdown mode!' : ''}`);
    }
}