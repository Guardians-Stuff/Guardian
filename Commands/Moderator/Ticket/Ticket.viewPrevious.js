const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Tickets = require('../../../Schemas/Tickets');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('view_previous')
        .setDescription('View a user\'s previous tickets.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to view')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        /** @type {Discord.TextChannel} */ let user = interaction.options.getUser('user');

        if(!user){
            const ticket = await Tickets.findOne({ guild: interaction.guild.id, channel: interaction.channel.id });
            if(!ticket) return EmbedGenerator.errorEmbed('User not found.');

            user = await client.users.fetch(ticket.user).catch(() => null);
            if(!user) return EmbedGenerator.errorEmbed('User not found.');
        }

        const tickets = await Tickets.find({ guild: interaction.guild.id, user: interaction.user.id, active: false });
        if(tickets.length == 0) return EmbedGenerator.errorEmbed('No previous tickets found.');

        let embeds = [];

        for (let i = 0; i < tickets.length; i += 10) {
            const ticketsSlice = tickets.slice(i, i + 10);

            const embed = EmbedGenerator.basicEmbed(ticketsSlice.map(ticket => `[${ticket._id.toString()}](${process.env.LIVE === 'true' ? 'https://guardianbot.space' : 'http://localhost:3001'}/guilds/${ticket.guild}/tickets/${ticket._id.toString()})`).join('\n'))
                .setTitle(`Previous Tickets`)
                .setTimestamp();

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds);
    }
}