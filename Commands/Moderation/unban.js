const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "unban",
    description: "UnBan's a member from your server.",
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMember"],
    category: "Moderation",
    options: [{
            name: "user-id",
            description: "Provide the user ID.",
            type: 3,
            required: true,
        },
    ],

    /**
     * 
     * @param {Client} client  
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: true
        })

        const {
            options,
            user,
            guild
        } = interaction

        const id = options.getString("user-id")
        if (isNaN(id)) return EditReply(interaction, "❌", `Invalid ID`)

        const bannedMembers = await guild.bans.fetch()
        if (!bannedMembers.find(x => x.user.id === id)) return EditReply(interaction, "❌", `The user is not banned yet!`)


        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("unban-yes")
            .setLabel("Yes"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId("unban-no")
            .setLabel("No"),
        )

        const Page = await interaction.editReply({
            embeds: [
                Embed.setDescription(`**⚠️ | Do you really want to unban this member?**`)
            ],
            components: [row]
        })

        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s")
        })

        col.on("collect", i => {
            if (i.user.id !== user.id) return

            switch (i.customId) {
                case "unban-yes": {

                    guild.members.unban(id)

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | User is now unbanned.`)
                        ],
                        components: []
                    })
                }
                break;

            case "unban-no": {
                interaction.editReply({
                    embeds: [
                        Embed.setDescription(`✅ | unban request cancelled`)
                    ],
                    components: []
                })
            }
            break;
            }
        })

        col.on("end", (collected) => {
            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`❌ | You didn't provide a valid response in time!`)
                ],
                components: []
            })
        })
    }
}