const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const Giveaways = require('../../Schemas/Giveaways');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('cancel')
        .setDescription('Cancel a giveaway.')
        .addStringOption(option => option
            .setName('id')
            .setDescription('Discord message ID of the giveaway')
            .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const id = interaction.options.getString('id', true);

        const giveaway = await Giveaways.findOne({ guild: interaction.guild.id, giveaway: id });
        if(!giveaway) return { embeds: [ EmbedGenerator.errorEmbed('Giveaway not found.') ], ephemeral: true };
        if(!giveaway.active) return { embeds: [ EmbedGenerator.errorEmbed('That giveaway is not active.') ], ephemeral: true };

        /** @type {Discord.TextChannel} */ const channel = await interaction.guild.channels.fetch(giveaway.channel).catch(() => null);
        if(channel){
            const message = await channel.messages.fetch({ message: id }).catch(() => null);
            if(message){
                const embed = new Discord.EmbedBuilder(message.embeds[0].data);
                embed.setDescription([
                    giveaway.description ? giveaway.description : null,
                    giveaway.description ? '' : null,
                    `Winners: **${giveaway.winners}**, Entries: **${giveaway.entries.length}**`,
                    `Status: Cancelled`
                ].filter(text => text !== null).join('\n'));

                await message.edit({ embeds: [ embed ], components: [] });
                await channel.send({
                    embeds: [ EmbedGenerator.basicEmbed(`💔 | The giveaway has been cancelled!`) ],
                    reply: { messageReference: message }
                });
            }
        }

        await Giveaways.updateOne({ guild: interaction.guild.id, giveaway: id }, { $set: { active: false } });
        return { embeds: [ EmbedGenerator.basicEmbed('Giveaway cancelled.') ], ephemeral: true };
    }
}