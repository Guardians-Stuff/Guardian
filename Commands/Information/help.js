const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { loadFiles } = require('../../Functions/fileLoader');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help from the bot')
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('category')
            .setDescription('The category to get help for')
            .addChoices(
                { name: 'Public', value: 'Public' },
                { name: 'Fun', value: 'Fun' },
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

        const commandFiles = await loadFiles(`Commands/${category}/`);

        const commands = {};
        for(const commandFile of commandFiles){
            const command = require(commandFile);
            if(command.data instanceof Discord.SlashCommandSubcommandBuilder) continue;

            if(command.subCommands) for(const subcommand of command.subCommands){
                commands[`${command.data.name} ${subcommand.data.name}`] = subcommand.data;
            }

            commands[`${command.data.name}`] = command.data;
        }

        const processed = [];
        for(const [name, data] of Object.entries(commands)){
            const options = data.options
                .filter(option => option.type != 1 && option.type != 2)
                .map(option => [
                    option.required ? '<' : '[',
                    option.type == 4 || option.type == 10 ? '#' : '',
                    option.type == 6 ? '@' : '',
                    option.type == 7 ? '@#' : '',
                    option.type == 8 ? '@&' : '',
                    option.type == 9 ? '@' :    '',
                    option.name,
                    option.required ? '>' : ']'
                ].join(''))
                .join(' ');

            processed.push([
                `**${name}** - ${data.description}`,
                `Usage: \`/${name}${options ? ` ${options}` : ''}\``,
                ''
            ].join('\n'));
        }

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