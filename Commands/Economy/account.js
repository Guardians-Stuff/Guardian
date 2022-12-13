const { Client, ChatInputCommandInteraction } = require("discord.js")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")
const { EmbedBuilder } = require("@discordjs/builders")


module.exports = {
    name: "account",
    description: "Create, Delete or check balance of account",
    category: "Economy",
    options: [
        {
            name: "choices",
            description: "Select an option",
            required: true,
            type: 3,
            choices: [
                {
                    name: "Create",
                    value: "create"
                },
                {
                    name: "Balance",
                    value: "balance"
                },
                {
                    name: "Delete",
                    value: "delete"
                },
            ]
        }
    ],

    async execute(interaction, client) {

        const { options, user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })

        switch (options.getString("choices")) {

            case "create": {
                if (Data) return Reply(interaction, "❌", `${user}, your account is already here!`, true)

                await interaction.deferReply()

                Data = new AccountDB({
                    User: user.id,
                    Bank: 5000,
                    Wallet: 1000
                })

                await Data.save()

                EditReply(interaction, "✅", `You're account has been created, and you've got ${Data.Bank} in your bank and ${Data.Wallet} in your wallet.`)
            }

                break;

            case "balance": {
                if (!Data) return Reply(interaction, "❌", `Please create an account first!`, true)

                await interaction.deferReply()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle(`Account Balance`)
                            .setDescription(`**Bank:** ${Data.Bank}\n**Wallet:** ${Data.Wallet}\n**Total:** ${Data.Bank + Data.Wallet}`)
                    ]
                })

            }

                break;

            case "delete": {
                if (!Data) return Reply(interaction, "❌", `Please create an account first!`, true)

                await interaction.deferReply()

                await Data.delete

                EditReply(interaction, "✅", `Your account has been deleted.`)
                

            }

                break;
        }

    }
}