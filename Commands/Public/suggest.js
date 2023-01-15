const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('suggest')
        .setDMPermission(false)
        .setDescription('Make a suggestion.')
        .addStringOption(option => option
            .setName('suggestion')
            .setDescription('Your suggestion.')
            .setMaxLength(4096)
            .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const suggestion = interaction.options.getString('suggestion', true);

        if(!dbGuild.suggestion.enabled) return { embeds: [ EmbedGenerator.errorEmbed('This guild has not enabled the Suggestion system.') ], ephemeral: true };

        const channel = await interaction.guild.channels.fetch(dbGuild.suggestion.channel);
        if(!channel || !(channel instanceof Discord.TextChannel)) return { embeds: [ EmbedGenerator.errorEmbed('Unable to fetch suggestion channel.') ], ephemeral: true };

        channel.send({ embeds: [
            EmbedGenerator.basicEmbed(suggestion)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
            ]
        }).then(async sent => {
            if(dbGuild.suggestion.reactions){
                await sent.react('✅')
                await sent.react('❌');
            }

            interaction.reply({ embeds: [ EmbedGenerator.basicEmbed('Suggested.') ], ephemeral: true });
        }).catch(() => {
            interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
        });
    }
};

