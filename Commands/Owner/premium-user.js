const { Client, ChatInputCommandInteraction } = require("discord.js")
const DB = require("../../Structures/Schemas/PremiumUser")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "premium-user",
    description: "Classified command.",
    UserPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "add",
            description: "Adds premium to a user.",
            type: 1,
            options: [
                {
                    name: "target",
                    description: "Select your target.",
                    type: 6,
                    required: true
                }
            ],
        },
        {
            name: "remove",
            description: "Removes premium to a user.",
            type: 1,
            options: [
                {
                    name: "target",
                    description: "Select your target.",
                    type: 6,
                    required: true
                }
            ],
        }
    ],

    async execute(interaction, client) {

        await interaction.deferReply({ ephemral: true })

        const { options, guild } = interaction

        const Sub = options.getSubcommand()

        switch (Sub) {
            case "add": {

                const Target = options.getMember("target")

                let Data = await DB.findOne({ User: Target.id }).catch(err => { })
                if (Data) return EditReply(interaction, "❌", `This user is already a premium user!`)

                Data = new DB({
                    User: Target.id
                })
                await Data.save()

                EditReply(interaction, "✅", `${Target} is now a premium member.`)

            }

                break;

            case "remove": {

                const Target = options.getMember("target")

                let Data = await DB.findOne({ User: Target.id }).catch(err => { })
                if (!Data) return EditReply(interaction, "❌", `This user is not a premium user!`)

                await Data.delete()
                EditReply(interaction, "✅", `${Target} is not a premium member anymore.`)


            }

                break;
        }

    }
}