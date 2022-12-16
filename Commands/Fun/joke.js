// Dependencies: axios
// Installation: npm i axios

const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const axios = require("axios")

module.exports = {
    name: "dadjoke",
    description: "Get random dad jokes",

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        const Embed = new EmbedBuilder()

        try {
            const response = await axios.get("https://some-random-api.ml/others/joke")

            Embed
                .setColor("Blue")
                .setDescription(response.data.joke)

            await interaction.reply({ embeds: [Embed], fetchReply: true })

        } catch (error) {
            Embed.setDescription(`Something went wrong. Try again later!`)
            interaction.reply({ embeds: [Embed], ephemeral: true })
        }

    }
}