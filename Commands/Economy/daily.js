const { Client, ChatInputCommandInteraction } = require("discord.js")
const ms = require("ms")
const AccountDB = require("../../Structures/Schemas/Account")
const ActionsDB = require("../../Structures/Schemas/MoneyActions")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "daily",
    description: "Claim your daily bonus.",
    category: "Economy",

    async execute(interaction, client) {

        const { user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first!`, true)

        let AData = await ActionsDB.findOne({ User: user.id }).catch(err => { })

        if (!AData) {

            await interaction.deferReply()

            let Timeout = Date.now() + ms("id")

            AData = new ActionsDB({
                User: user.id,
                Daily: Timeout
            })

            await AData.save()

            Collect()
        } else {

            if (AData.Daily > Date.now()) return Reply(interaction, "❌", `You've already collected your daily reward but you can come back in <t:${parseInt(AData.Daily / 1000)}:R> to collect it again!`, true)

            await interaction.deferReply()

            let Timeout = Date.now() + ms("id")

            AData.Daily = Timeout
            await AData.save()

            Collect()
        }

        async function Collect() {

            const Amount = Math.ceil(Math.random() * 5000)

            Data.Wallet += Amount 
            await Data.save()

            EditReply(interaction, "✅", `You've $${amount} as your daily reward.`)
        }
    }
}