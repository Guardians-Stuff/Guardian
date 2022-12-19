const { Client, ChatInputCommandInteraction } = require("discord.js")
const VoucherDB = require("../../Structures/Schemas/Voucher")
const EditReply = require("../../Systems/EditReply")
const { generate } = require("voucher-code-generator")

module.exports = {
    name: "generate",
    description: "Classified command.",
    category: "Owner",

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guild, options, user } = interaction

        let Data = await VoucherDB.findOne({ User: user.id }).catch(err => { })

        const generatedForThirty = generate({
            length: 8,
            count: 1
        })

        const generatedForTwo = generate({
            length: 8,
            count: 1
        })

        if(!Data) {
            Data = new VoucherDB({
                User: user.id,
                ThirtyDay: generatedForThirty,
                TwoMonth: generatedForTwo
            })
            await Data.save()

            EditReply(interaction, "✅", `Generated the new premium code with: ${generatedForThirty}`)

        } else {

            Data.ThirtyDay = generatedForThirty
            Data.TwoMonth = generatedForTwo
            await Data.save()

            EditReply(interaction, "✅", `Generated the new premium code with: ${generatedForTwo}`)
        }
    }
}