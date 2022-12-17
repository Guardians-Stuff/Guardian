const { Client, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")
const AccountDB = require("../../Structures/Schemas/Account")
const ActionsDB = require("../../Structures/Schemas/MoneyActions")

module.exports = {
    name: "search",
    description: "Search in random places for $$$$.",
    category: "Economy",


    async execute(interaction, client) {

        const { user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first! \`/account create\``, true)

        let Adata = await ActionsDB.findOne({ User: user.id }).catch(err => { })

        const locations = ["Toilet", "Sink"]

        const location = locations.sort(() => Math.random() - Math.random()).slice(0, 3)

        let components = []

        locations.forEach(async x => {
            let name = x
            let idName = name.toLowerCase().toString()
            let xName = name

            components.push(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(idName)
                    .setLabel(xName)
            )
        })

        const Row = new ActionRowBuilder().addComponents(components)

        const Amount = Math.floor(Math.random() * 1500) + 500

        if (!Adata) {

            await interaction.deferReply()

            let Timeout = Date.now() + ms("30s")

            AData = new ActionsDB({
                User: user.id,
                Search: Timeout
            })
            await Data.save()

            Search()
        } else {
            if (Adata.Search > Date.now()) return Reply(interaction, "❌", `You've already searched once, come back in <t:${parseInt(Adata.Search / 1000)}:R>`, true)

            await interaction.deferReply()

            let Timeout = Date.now() + ms("30s")

            Adata.Search = Timeout
            await Data.save()

            Search()
        }
        async function Search() {
            const Embed = new EmbedBuilder()
                .setColor(client.color)

            const Page = await interaction.editReply({
                embeds: [
                    Embed.setDescription(`❓ | Where do you want to search?\nPick an option\n${location.join(" ")}`)
                ],
                components: [Row]
            })

            const col = await Page.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: ms("30s")

            })

            col.on("collect", async i => {

                if (i.user.id !== user.id) return

                const Searched = i.customId.toUpperCase()

                Data.Wallet += Amount
                await Data.save()

                return interaction.editReply({
                    embeds: [
                        Embed
                            .setDescription(`You've found $${Amount} by searching ${Searched}!`)
                    ],
                    components: []
                })

            })

            col.on("end", collected => {
                if (collected.size === 0) {

                    return interaction.editReply({
                        embeds: [
                            Embed
                                .setDescription(`❌ | You didn't provide a response in time!`)
                        ],
                        components: []
                    })

                }
            })

        }
    }
}