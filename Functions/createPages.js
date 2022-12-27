const Discord = require('discord.js');

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Array<Discord.MessageEmbed>} embeds 
 */
async function createPages(interaction, embeds){
    if(embeds.length == 0) return interaction.reply({ content: 'There was an error.', ephemeral: true });
    if(embeds.length == 1) return interaction.reply({ embeds: [ embeds[0].setFooter({ text: 'Page 1/1' }) ] });

    let page = 0;
    const sent = await interaction.reply({
        embeds: [ embeds[page].setFooter({ text: `Page ${page + 1}/${embeds.length}` }) ],
        components: [ new Discord.ActionRowBuilder().addComponents([
            new Discord.ButtonBuilder().setCustomId('previous').setEmoji('◀️').setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId('next').setEmoji('▶️').setStyle(Discord.ButtonStyle.Primary)
        ]) ],
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

module.exports = { createPages };