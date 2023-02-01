const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');
const config = require('../../../config.json');

const Tickets = require('../../../Schemas/Tickets');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('close')
        .setDescription('Close the ticket.')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Ticket to close')
            .addChannelTypes(Discord.ChannelType.GuildText)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        /** @type {Discord.TextChannel} */ const channel = interaction.options.getChannel('channel') || interaction.channel;
        const ticket = await Tickets.findOne({ guild: interaction.guild.id, channel: channel.id });

        if(!ticket) return EmbedGenerator.errorEmbed('Ticket not found.');
        if(!ticket.active) return EmbedGenerator.errorEmbed('That ticket is not active.');

        await interaction.deferReply();
        
        const promises = [ ...new Set([ interaction.user.id, ticket.user, ...ticket.messages.map(message => message.user) ]) ].map(id => {
            return new Promise(async resolve => {
                const user = await client.users.fetch(id).catch(() => null);
                if(user && !user.bot) await user.send({ embeds: [
                    EmbedGenerator.basicEmbed(`A ticket you were involved in has been closed.\nYou can view an export of the ticket [here](${config.live ? 'https://guardianbot.space' : 'http://localhost:3001'}/ticket?id=${ticket._id.toString()}).`)
                    .setTitle(`${channel.name} | Closed`)
                ] }).catch(() => null);
                
                resolve();
            });
        });
        await Promise.all(promises);

        await Tickets.updateOne({ guild: interaction.guild.id, channel: channel.id }, { $set: { active: false }, $push: { messages: { 
            user: interaction.user.id,
            message: 'This ticket has been closed.'
        } } });

        await interaction.editReply({ embeds: [ EmbedGenerator.basicEmbed('This ticket has been closed.') ] });
        await interaction.channel.delete(`Ticket closed by ${interaction.user.id}`).catch(() => null);
    }
}