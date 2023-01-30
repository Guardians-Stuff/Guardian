const { PermissionFlagsBits, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("iteminfo")
        .setDescription("View information about an item")
        .addIntegerOption((option) =>
            option
                .setName("item")
                .setDescription("The id of the item to view")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const item = interaction.options.getInteger("item");

        fs.readFile("./data/items.json", (err, data) => {
            if (err) throw err;
            const itemsJSON = JSON.parse(data);

            if (item > itemsJSON.length) {
                return interaction.reply({
                    content: "🚫 That item does not exist",
                    ephemeral: true,
                });
            }
            const itemInfo = itemsJSON[item - 1];
            const itemEmbed = new EmbedBuilder()
                .setTitle(itemInfo.name)
                .setDescription(itemInfo.description)
                .setColor(0x00ff00)
                .addFields(
                    {
                        name: "Price",
                        value: `${`₳${itemInfo.price}` || "N/A"}`,
                        inline: true,
                    },
                    {
                        name: "id",
                        value: `${itemInfo.id}`,
                        inline: true,
                    },
                    {
                        name: "Type",
                        value: `${itemInfo.type}`,
                        inline: true,
                    },
                    {
                        name: "Sellable",
                        value: `${itemInfo.sellable}`,
                        inline: true,
                    },
                    {
                        name: "Buyable",
                        value: `${itemInfo.buyable}`,
                        inline: true,
                    }
                );
            return interaction.reply({
                embeds: [itemEmbed],
            });
        });
    },
};