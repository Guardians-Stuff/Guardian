const Discord = require('discord.js');
const fs = require('fs');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help from the bot')
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('category')
            .setDescription('The category to get help for')
            .addChoices(
                { name: 'Fun', value: 'Fun' },
                //{ name: "Giveaways", value: "Giveaways" },
                { name: 'Information', value: 'Information' },
                { name: 'Moderation', value: 'Moderator' },
                { name: 'Utility', value: 'Public' },
                { name: 'Admin', value: 'Administrator' }
            )
            .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const category = interaction.options.getString('category', true);

        const commandFiles = fs.readdirSync(`${__dirname}/../../Commands/${category}`).filter(file => file.endsWith('.js'));
        /** @type {Array<Discord.SlashCommandBuilder>} */ const commands = commandFiles.map(commandFile => require(`../../Commands/${category}/${commandFile}`).data);
        const processed = commands.map(command => {
            const options = command.options
                .filter(option => option.type != 1 && option.type != 2)
                .map(option => [
                    option.required ? '<' : '[',
                    option.type == 4 || option.type == 10 ? '#' : '',
                    option.type == 6 ? '@' : '',
                    option.type == 7 ? '@#' : '',
                    option.type == 8 ? '@&' : '',
                    option.type == 9 ? '@' : '',
                    option.name,
                    option.required ? '>' : ']'
                ].join(''))
                .join(' ');

            return [
                `**${command.name}** - ${command.description}`,
                `Usage: \`/${command.name}${options ? ` ${options}` : ''}\``,
                ''
            ].join('\n')
        });

        let embeds = [];

        for (let i = 0; i < processed.length; i += 5) {
            const processedSlice = processed.slice(i, i + 5);

            const embed = EmbedGenerator.basicEmbed([
                `Commands in ${category}`,
                '',
                processedSlice.join(`\n`)
            ].join('\n'))
                .setTitle(`${category}`)
                .setTimestamp();

            embeds.push(embed);
        }

        await EmbedGenerator.pagesEmbed(interaction, embeds);
        // interaction.user.createDM().then(channel => {
        //     channel.send({ embeds: [ embed ] }).then(() => {
        //         interaction.reply({ embeds: [ EmbedGenerator.basicEmbed('Please check your DMs!') ], ephemeral: true });
        //     }).catch(() => {
        //         interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
        //     })
        // }).catch(() => {
        //     interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
        // });
    }
};