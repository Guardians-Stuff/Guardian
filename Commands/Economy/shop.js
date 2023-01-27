const { PermissionFlagsBits, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View the shop")
        .addIntegerOption((option) =>
            option
                .setName("page")
                .setDescription("The page to view")
                .setRequired(false)
        ),
    async execute(interaction) {
        const page = interaction.options.getInteger("page") ?? 1;

        fs.readFile("./data/items.json", (err, data) => {
            if (err) throw err;
            const itemsJSON = JSON.parse(data);

            const shopEmbed = new EmbedBuilder()
                .setTitle("Guardian's Economy Shop")
                .setDescription(`Page ${page} of ${Math.ceil(itemsJSON.length / 5)}`)
                .setColor(0x00ff00);

            for (let i = 0; i < 5; i++) {
                if (
                    itemsJSON[i + (page - 1) * 5] &&
                    itemsJSON[i + (page - 1) * 5].buyable
                ) {
                    shopEmbed.addFields({
                        name: `${itemsJSON[i + (page - 1) * 5].name} - ${itemsJSON[i + (page - 1) * 5].id
                            }`,
                        value: `${itemsJSON[i + (page - 1) * 5].description} - $${itemsJSON[i + (page - 1) * 5].price
                            }`,
                        inline: false,
                    });
                }
            }

            return interaction.reply({
                embeds: [shopEmbed],
            });
        });
    },
};