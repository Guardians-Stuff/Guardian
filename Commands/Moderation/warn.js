const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/Warnings")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")


module.exports = {
    name: "warn",
    description: "Add, remove, or check warns of a user in the guild.",
    UserPerms: ["ManageGuild"],
    category: "Moderation",
    options: [
        {
            name: "add",
            description: "Adds a warning to a member",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select a user",
                    type: 6,
                    required: true
                },
                {
                    name: "reason",
                    description: "Provide a valid reason",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            name: "remove",
            description: "Removes a warning from a member",
            type: 1,
            options: [
                {
                    name: "warn-id",
                    description: "Provide the user warn ID",
                    type: 3,
                    required: true
                },
            ],
        },
        {
            name: "list",
            description: "Displays all warns of a member",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select a user",
                    type: 6,
                    required: true
                },
            ],
        }
    ],

    async execute(interaction, client) {

        const { options, user, guild } = interaction

        switch (options.getSubcommand()) {
            case "add": {
                const Target = options.getMember("user")
                const Reason = options.getString("reason") || "No reason provided"

                if (Target.id === user.id) return Reply(interaction, "❌", "You cannot warn yourself!")
                if (guild.ownerId === Target.id) return Reply(interaction, "❌", "You cannot warn the server/guild owner!")

                await interaction.deferReply()
                // Creating a new document in the Database //
                let Data = new DB({
                    User: Target.id,
                    Guild: guild.id,
                    Moderator: user.id,
                    Reason: Reason,
                    Timestamp: Date.now()
                })
                await Data.save()
                /////////////////////////////////////////////

                EditReply(interaction, `✅`, `**${Target}** has been warned for **${Reason}**`)
            }

                break;

            case "remove": {
                await interaction.deferReply()

                const WarnID = options.getString("warn-id")

                const Data = await DB.findOne({ _id: WarnID }).catch(err => { })
                if (!Data) return EditReply(interaction, "❌", "The ID you provide is not valid.")

                const Member = guild.members.cache.get(Data.User)

                await Data.delete()

                EditReply(interaction, `✅`, `Removed **warning** from **${Member}**!`)
            }

                break;

            case "list": {
                await interaction.deferReply()

                const Target = options.getMember("user")
                if (!Target) return EditReply(interaction, "❌", `The member doesn't exist!`)

                const UserWarns = await DB.find({ User: Target.id, Guild: guild.id }).catch(err => { })
                if (UserWarns.length === 0) return Reply(interaction, "❌", `The member doesn't have any warnings.`)

                const Mapped = UserWarns.map(warn => {
                    return `\`${warn._id}\` | ${warn.Reason}`
                }).join("\n")

                const Embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`${Mapped}`)

                interaction.editReply({ embeds: [Embed] })

            }

                break;
        }
    }
}