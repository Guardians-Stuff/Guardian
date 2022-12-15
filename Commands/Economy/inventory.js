const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const ShopItems = require("../../Systems/Items")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "inventory",
    description: "Check your inventory",
    category: "Economy",

    async execute(interaction, client) {

        const { user } = interaction 

        const Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

        await interaction.deferReply()

        const inventory = Object.keys(Data.Inventory).sort()

        const MappedData = inventory.map(a => {

            const Item = ShopItems.find(val => val.value === a)

            return `${Item.emoji} **${Item.name} -** ${Data.Inventory[Item.value]} | *ID* \`${Item.value}\``
        }).join("\n")

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTimestamp()
            .setAuthor({ name: `${user.username}'s Inventory!`})
            .setDescription(`${MappedData}`)

        interaction.editReply({ embeds: [Embed] })
    }
}