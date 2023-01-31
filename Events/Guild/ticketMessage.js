const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { GuildsManager } = require('../../Classes/GuildsManager');

const Tickets = require('../../Schemas/Tickets');

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        if(message.channel.type != Discord.ChannelType.GuildText || message.author.bot) return;

        const guild = await GuildsManager.fetch(message.guild.id);
        if(!guild.tickets.enabled || message.channel.parent?.id != guild.tickets.category) return;

        const ticket = await Tickets.findOne({ guild: message.guild.id, channel: message.channel.id, active: true });
        if(!ticket) return;

        await Tickets.updateOne({ guild: message.guild.id, channel: message.channel.id, active: true }, { $push: { messages: {
            user: message.author.id,
            message: message.content,
            images: message.attachments.map(attachment => attachment.url)
        } } });
    }
}