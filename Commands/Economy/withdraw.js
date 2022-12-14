const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")
const AccountDB = require("../../Structures/Schemas/Account")

module.exports = {
    name: "withdraw",
    description: "Withdraw your bank money.",
    category: "Economy",
    options: [
        {
            name: "amount",
            description: "Specify the amount (use 'all for all money)",
            required: true,
            type: 3
        }
    ],

    async execute(interaction, client) {

        const { options, user } = interaction

        const Amount = options.getString("amount")

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

        if (Amount.toLowerCase() === 'all') {

            if (Data.Bank === 0) return Reply(interaction, "❌", `You do not have enough money!`, true)

            await interaction.deferReply()

            Data.Wallet += Data.Bank 
            Data.Bank = 0
            await Data.save()

            return EditReply(interaction, "✅", `All money has been withdrawn successfully!`)
        } else {

            const Converted = Number(Amount)
            if (isNaN(Converted) === true) return Reply(interaction, "❌", `The amount can only be a number or \`all\`!`, true)
            if (Date.Bank < parseInt(Converted) || Converted === Infinity) return Reply(interaction, "❌", `You don't have enough money!`, true)

            await interaction.deferReply()

            Data.Wallet += parseInt(Converted)
            Data.Bank -= parseInt(Converted)
            Data.Bank = Math.abs(Data.Wallet)
            await Data.save()

            return EditReply(interaction, "✅", `Withdrawn $${parseInt(converted)} from the bank!`)
        }

    }

}