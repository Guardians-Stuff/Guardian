const canvacord = require('canvacord');
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pixelate')
        .setDescription("Pixelate someone's avatar")
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to pixelate').setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('The amount of pixels on each axis')
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(50)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;
        let amount = interaction.options.getInteger('amount') ?? 6;

        amount = amount - 1;

        let pixelate = await canvacord.Canvas.pixelate(
            user.displayAvatarURL({ format: 'png', dynamic: true }),
            amount
        );

        if (pixelate instanceof canvacord.Canvas) {
            let pixelate = await pixelate.toBuffer();
        }

        interaction.reply({
            files: [pixelate],
        });
    },
};
