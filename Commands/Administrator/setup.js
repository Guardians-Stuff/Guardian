const Discord = require(`discord.js`);

const EmbedGenerator = require('../../Functions/embedGenerator');

const Guilds = require('../../Schemas/Guilds');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup basic bot stuff.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
    ,
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        await interaction.reply({ embeds: [generateEmbed(0, [])] });

        if (!interaction.guild.members.me.permissions.has('Administrator')) {
            const embed = generateEmbed(0, []);
            return embed.setDescription(`${embed.data.description}\n\n❌ Bot is missing the administrator permissions!`);
        }

        await interaction.editReply({ embeds: [generateEmbed(1, [0])] });

        if (interaction.guild.roles.botRoleFor(client.user).position != interaction.guild.roles.highest.position) {
            const embed = generateEmbed(1, [0]);
            return embed.setDescription(`${embed.data.description}\n❌ Bot role is not the highest role in the server!`);
        }

        await interaction.editReply({ embeds: [generateEmbed(2, [0, 1])] });

        const guild = await Guilds.findOne({ guild: interaction.guild.id }) || await Guilds.create({ guild: interaction.guild.id });
        const memberLog = guild.logs.basic ? 2 : '';

        await interaction.editReply({ embeds: [generateEmbed(3, [0, 1, memberLog])] });

        const modLog = guild.logs.moderator ? 3 : '';

        await interaction.editReply({ embeds: [generateEmbed(4, [0, 1, memberLog, modLog])] });

        await new Promise(resolve => setTimeout(() => resolve(), 2000));

        await interaction.editReply({ embeds: [generateEmbed(6, [0, 1, memberLog, modLog, 4])] });
    }
}

/**
 * this is gonna be a horrible function
 * @param {Number} count
 * @param {Array<Number>} completed
 */
function generateEmbed(count, completed) {
    return EmbedGenerator.basicEmbed([
        '✅ Initializing Quick Setup!',
        count >= 0 ? `${count > 0 ? completed.includes(0) ? '✅ ' : '❌' : ''}Checking for permissions...` : '',
        count >= 1 ? `${count > 1 ? completed.includes(1) ? '✅ ' : '❌' : ''}Checking Guardian\'s role position...` : '',
        count >= 2 ? `${count > 2 ? completed.includes(2) ? '✅ ' : '❌' : ''}Checking for a log channel...` : '',
        count >= 3 ? `${count > 3 ? completed.includes(3) ? '✅ ' : '❌' : ''}Checking for a mod-log channel...` : '',
        count >= 4 ? `${count > 4 ? completed.includes(4) ? '✅ ' : '❌' : ''}Finishing up...` : '',
        count >= 5 ? 'All checks completed!' : '',
    ].filter(i => i != '').join('\n'))
        .setTitle('Guardian Setup:');
}