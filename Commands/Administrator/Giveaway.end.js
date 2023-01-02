const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { pickUnique } = require('../../Functions/pickUnique');

const Giveaways = require('../../Schemas/Giveaways');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('end')
        .setDescription('Manually end a giveaway.')
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
        if(!channel) return { embeds: [ EmbedGenerator.errorEmbed('Unable to fetch the channel.') ], ephemeral: true };

        const message = await channel.messages.fetch({ message: id }).catch(() => null);
        if(!message) return { embeds: [ EmbedGenerator.errorEmbed('Unable to fetch the message.') ], ephemeral: true };

        /** @type {Array<String>} */ const winners = pickUnique(giveaway.entries, giveaway.winners);

        const embed = new Discord.EmbedBuilder(message.embeds[0].data);
        embed.setDescription([
            giveaway.description ? giveaway.description : null,
            giveaway.description ? '' : null,
            `Winners: **${giveaway.winners}**, Entries: **${giveaway.entries.length}**`,
            `Status: Manually ended`
        ].filter(text => text !== null).join('\n'));

        await message.edit({ embeds: [ embed ], components: [] });

        if(winners.length == 0){
            await channel.send({
                embeds: [ EmbedGenerator.errorEmbed(`💔 | Nobody entered the giveaway, there are no winners!`) ],
                reply: { messageReference: message }
            });
        }else{
            await channel.send({
                content: winners.map(id => `<@${id}>`).join(' '),
                embeds: [ EmbedGenerator.basicEmbed(`Congratulations winners!`) ],
                reply: { messageReference: message }
            });
        }


        await Giveaways.updateOne({ guild: interaction.guild.id, giveaway: id }, { $set: { active: false } });
        return { embeds: [ EmbedGenerator.basicEmbed('Giveaway ended.') ], ephemeral: true };
    }
}