const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const AccountDB = require("../../Structures/Schemas/Account")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")


module.exports = {
    name: "account",
    description: "Create, Delete or check a balance of a account.",
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
                }
            ]
        }
    ],

    async execute(interaction, client) {

        const { options, user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })

        switch (options.getString("choices")) {

            case "create": {
                if (Data) return Reply(interaction, "❌", `${user}, you already have a account!`, true)

                await interaction.deferReply()

                Data = new AccountDB({
                    User: user.id,
                    Bank: 5000,
                    Wallet: 1000
                })
                await Data.save()

                //EditReply(interaction, "✅", `You account has been successfully created! I have given you a start up of $${Data.Bank} deposited in your bank and $${Data.Wallet} inside of your wallet!`)

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle("Created Account!")
                            .setDescription(`I have given you $${Data.Bank} inside of your bank and $${Data.Wallet} inside of your wallet!`)
                            .setTimestamp()
                    ]
                })

            }
                break;

            case "balance": {
                if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

                await interaction.deferReply()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle("Account Balance:")
                            .setDescription(`**Bank:** $${Data.Bank}\n**Wallet:** $${Data.Wallet}\n**Total:** $${Data.Bank + Data.Wallet}`)
                            .setTimestamp()
                    ]
                })

            }
                break;

            case "delete": {
                if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

                await interaction.deferReply()

                await Data.delete()

                EditReply(interaction, "✅", `You have deleted your account!`)

            }
                break;

        }
    }
}