const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const ms = require("ms")
const AccountDB = require("../../Structures/Schemas/Account")
const ActionsDB = require("../../Structures/Schemas/MoneyActions")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")


module.exports = {
    name: "daily",
    description: "Collect your daily reward.",
    category: "Economy",

    async execute(interaction, client) {

        const { user } = interaction

        let Data = await AccountDB.findOne({ User: user.id}).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

        let AData = await ActionsDB.findOne({ User: user.id }).catch(err => { })

        if (!AData) {

            await interaction.deferReply()

            let Timeout = Date.now() + ms("1d")

            AData = new ActionsDB({
                User: user.id,
                Daily: Timeout
            })
            await AData.save()

            Collect()
        } else {
            if (AData.Daily > Date.now()) return Reply(interaction, "❌", `You have already collected your daily reward today! Please come back in <t:${parseInt(AData.Daily / 1000)}:R>`, true)

            await interaction.deferReply()

            let Timeout = Date.now() + ms("1d")

            AData.Daily = Timeout
            await AData.save()

            Collect()
        }

        async function Collect() {

            const Amount = Math.ceil(Math.random() * 5000)

            Data.Wallet += Amount
            await Data.save()

            EditReply(interaction, "✅", `You have claimed $${Amount} as your daily reward!`)

        }
    }
    
    }