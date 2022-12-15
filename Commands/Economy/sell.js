const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const ShopItems = require("../../Systems/Items")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "sell",
    description: "Sell something from your inventory.",
    category: "Economy",
    options: [
        {
            name: "item-id",
            description: "Provide the ID of the item",
            type: 3,
            required: true
        },
        {
            name: "quantity",
            description: "Provide the quantity",
            type: 4,
            required: false
        }
    ],

    async execute(interaction, client) {

        const { options, user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

        const ItemName = options.getString("item-id").toLowerCase()
        const Quantity = options.getInteger("quantity") || 1

        const validItem = ShopItems.find(val => val.name.toLowerCase() === ItemName)
        if (!validItem) return Reply(interaction, "❌", `This is not a valid shop item!`, true)

        const Amount = Math.ceil(Math.random() * 3000) * Quantity

        if (Object.keys(Data.Inventory).length === 0) return Reply(interaction, "❌", `There is no item in your inventory!`, true)
        if (!Object.keys(Data.Inventory).includes(validItem.value)) return Reply(interaction, "❌", `You dont have this item in your inventory!`, true)
        if (Data.Inventory[validItem.value] === 0) return Reply(interaction, "❌", `You dont have this item in your inventory!`, true)
        if (Data.Inventory[validItem.value] === 0) return Reply(interaction, "❌", `You only have ${Data.Inventory[validItem.value]}x in your inventory!`, true)

        await interaction.deferReply()

        if (!Data.Inventory) Data.Inventory = {}
        await Data.save()

        Data.Inventory[validItem.value] -= Quantity
        Data.Inventory[validItem.value] = Math.abs(Data.Inventory[validItem.value])

        await AccountDB.findOneAndUpdate({ User: user.id }, Data)

        Data.Wallet += Amount
        await Data.save()

        return EditReply(interaction, "✅", `${user} has sold **${Quantity}** **${validItem.name}** from their inventory.`)

    }
}