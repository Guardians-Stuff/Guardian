const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const ShopItems = require("../../Systems/Items")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "buy",
    description: "Buy something from the shop.",
    category: "Economy",
    options: [
        {
            name: "item-name",
            description: "Provide the name of the item",
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

        const ItemName = options.getString("item-name").toLowerCase()
        const Quantity = options.getString("quantity") || 1

        const validItem = ShopItems.find(val => val.name.toLowerCase() === ItemName)
        if (!validItem) return Reply(interaction, "❌", `This is not a valid shop item!`, true)

        const Price = validItem.price * Quantity
        if (Data.Wallet < Price) return Reply(interaction, "❌", `You do not have enough money on your balance to buy this item!`, true)

        await interaction.deferReply()

        if (!Data.Inventory) Data.Inventory = {}
        await Data.save()

        if (!Object.keys(Data.Inventory).includes(validItem.value)) Data.Inventory[validItem.value] = Quantity
        else Data.Inventory[validItem.value] += Quantity

        await AccountDB.findOneAndUpdate({ User: user.id }, Data)

        Data.Wallet -= Price
        Data.Wallet = Math.abs(Data.Wallet)
        await Data.save()

        return EditReply(interaction, "✅", `${user} has bought **${Quantity}** **${validItem.name}** from the local store.`)

    }
}