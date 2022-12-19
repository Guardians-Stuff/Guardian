const { Client, ChatInputCommandInteraction } = require("discord.js")
const VoucherDB = require("../../Structures/Schemas/Voucher")
const PremiumGuildDB = require("../../Structures/Schemas/PremiumGuild")
const EditReply = require("../../Systems/EditReply")
const { generate } = require("voucher-code-generator")

module.exports = {
    name: "redeem",
    description: "Reedms a premium code for the server.",
    category: "Utility",
    options: [
        {
            name: "voucher",
            description: "Enter your voucher",
            type: 3,
            required: true
        }
    ],

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guild, options } = interaction

        const Voucher = options.getString("voucher")

        const VoucherData = await VoucherDB.findOne({ ThirtyDay: Voucher }).catch(err => { })
        if (!VoucherData) return EditReply(interaction, "❌", `Not a valid premium coupon!`)

        const code = generate({
            length: 8,
            count: 1
        })

        const generated = code[0]

        VoucherData.ThirtyDay = generated
        await VoucherData.save()

        let Data = await PremiumGuildDB.findOne({ Guild: guild.id }).catch(err => { })
        if (Data) return EditReply(interaction, "❌", `This guild is already a premium guild!`)

        Data = new PremiumGuildDB({
            Guild: guild.id
        })
        await Data.save()

        EditReply(interaction, "✅", `${guild.name} is now a premium guild.`)

    }
}