const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('math')
        .setDescription('Perform a math operation.')
        .addNumberOption((option) =>
            option.setName('num1').setDescription('The first number').setRequired(true)
        )
        .addNumberOption((option) =>
            option.setName('num2').setDescription('The second number').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('operation')
                .setDescription('The operation to perform')
                .setRequired(true)
                .addChoice('+', '+')
                .addChoice('-', '-')
                .addChoice('*', '*')
                .addChoice('/', '/')
        )
        .setDMPermission(false),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const num1 = interaction.options.getNumber('num1');
        const num2 = interaction.options.getNumber('num2');
        const operation = interaction.options.getString('operation');
        let result;
        switch (operation) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num1 / num2;
                break;
            default:
                return interaction.reply('Invalid operation provided.');
        }
        interaction.reply(`The result of ${num1} ${operation} ${num2} is ${result}.`);
    },
};
