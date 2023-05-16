const Discord = require(`discord.js`);

const afkUsers = new Map();

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set yourself as AFK')
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for being AFK').setRequired(false)
        ),
    async execute(interaction, client) {
        const user = interaction.user;
        const reason = interaction.options.getString('reason') || 'No reason provided';

        afkUsers.set(user.id, reason);

        await interaction.reply(`You have been set as AFK. Reason: ${reason}`);

        client.on('messageCreate', async (message) => {
            if (message.author.bot) return;

            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) return;

            const mentionedUserId = mentionedUser.id;
            if (mentionedUserId !== user.id) return;

            const mentionedUserMember = message.mentions.members.first();
            if (!mentionedUserMember) return;

            await message.delete();
            await message.channel.send(`${user} is currently AFK. Reason: ${reason}`);
        });

        client.on('typingStart', async (channel, user) => {
            if (user.bot) return;

            if (user.id === interaction.user.id) {
                afkUsers.delete(user.id);
                await interaction.reply(
                    `Welcome back ${user}! You have been removed from the AFK list.`
                );
            }
        });
    },
};
