const Discord = require('discord.js');

/**
 * @param {String} [description]
 */
function basicEmbed(description){
    const embed = new Discord.EmbedBuilder().setColor('Green');
    if(description) embed.setDescription(description);

    return embed;
}

/**
 * @param {String} [description]
 */
function errorEmbed(description = 'There was an error.'){
    return new Discord.EmbedBuilder()
        .setColor('Red')
        .setDescription(description);
}

/**
 * 
 * @param {Discord.ChatInputCommandInteraction} interaction 
 * @param {Array<Discord.MessageEmbed>} embeds
 * @param {Boolean} ephemeral
 */
async function pagesEmbed(interaction, embeds, ephemeral = false){
    if(embeds.length == 0) return interaction.reply({ content: 'There was an error.', ephemeral: true });
    if(embeds.length == 1) return interaction.reply({ embeds: [ embeds[0].setFooter({ text: 'Page 1/1' }) ], ephemeral: ephemeral });

    let page = 0;
    const sent = await interaction.reply({
        embeds: [ embeds[page].setFooter({ text: `Page ${page + 1}/${embeds.length}` }) ],
        components: [ new Discord.ActionRowBuilder().addComponents([
            new Discord.ButtonBuilder().setCustomId('previous').setEmoji('◀️').setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId('next').setEmoji('▶️').setStyle(Discord.ButtonStyle.Primary)
        ]) ],
        ephemeral: ephemeral,
        fetchReply: true
    });
    const filter = (/** @type {Discord.MessageComponentInteraction} */ i) => [ 'previous', 'next' ].includes(i.customId) && i.message.id == sent.id && interaction.member.id == i.user.id;
    const collector = sent.createMessageComponentCollector({ filter, time: 120000 });

    collector.on('collect', async i => {
        if(i.customId == 'previous'){
            page = Math.max(0, page - 1);
            i.update({ embeds: [ embeds[page].setFooter({ text: `Page ${page + 1}/${embeds.length}` }) ] });
        }else if(i.customId == 'next'){
            page = Math.min(embeds.length - 1, page + 1);
            i.update({ embeds: [ embeds[page].setFooter({ text: `Page ${page + 1}/${embeds.length}` }) ] });
        }
    });
}

module.exports = {
    basicEmbed,
    errorEmbed,
    pagesEmbed
}