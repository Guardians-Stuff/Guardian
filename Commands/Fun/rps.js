//Dependencies - ms (https://www.npmjs.com/package/ms)
//Installation - npm i ms

const { Client, ChatInputCommandInteraction, ComponentType, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "rps",
    description: "Play a rock paper scissor game",
    category: 'Fun',

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { user, guild } = interaction
        let choices = ["rock", "paper", "scissor"]
        const botchoice = `${choices[(Math.floor(Math.random() * choices.length))]}`
        console.log(`The bot choosed ${botchoice}`)

        const Embed = new EmbedBuilder()
            .setColor("DarkOrange")
            .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
            .setDescription(`<@${user.id}> choose your move`)

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("rock")
                .setLabel("Rock")
                .setEmoji(`✊`),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("paper")
                .setLabel("Paper")
                .setEmoji(`✋`),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("scissor")
                .setLabel("Scissor")
                .setEmoji(`✌`),

        )

        const Page = await interaction.reply({

            embeds: [Embed],
            components: [row]
        })
        const col = Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("10s")
        })
        col.on("collect", i => {

            switch (i.customId) {

                case "rock": {

                    if (botchoice == "rock") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`Game tied\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Rock", inline: true },
                                        { name: "My choice", value: "Rock", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }

                    if (botchoice == "paper") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`You lost the game\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Rock", inline: true },
                                        { name: "My choice", value: "Paper", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                    if (botchoice == "scissor") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`You won the game\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Rock", inline: true },
                                        { name: "My choice", value: "Scissor", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                }
                    break;
                case "paper": {
                    if (botchoice == "rock") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`You won the game\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Paper", inline: true },
                                        { name: "My choice", value: "Rock", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }

                    if (botchoice == "paper") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`Game tied\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Paper", inline: true },
                                        { name: "My choice", value: "Paper", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                    if (botchoice == "scissor") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`You lost the game\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Paper", inline: true },
                                        { name: "My choice", value: "Scissor", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                }
                    break;

                case "scissor": {

                    if (botchoice == "rock") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`You lost the game\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Scissor", inline: true },
                                        { name: "My choice", value: "Rock", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }

                    if (botchoice == "paper") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`You won the game\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Scissor", inline: true },
                                        { name: "My choice", value: "Paper", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                    if (botchoice == "scissor") {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`DarkOrange`)
                                    .setAuthor({ name: "Rock Paper Scissor", iconURL: user.displayAvatarURL() })
                                    .setDescription(`\`\`\`Game tied\`\`\``)
                                    .addFields(
                                        { name: "Your choice", value: "Scissor", inline: true },
                                        { name: "My choice", value: "Scissor", inline: true }
                                    )
                            ],
                            components: []
                        })
                    }
                }
                    break;
            }
        })
        col.on("end", (collected) => {

            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`You didn't choosed your move`)
                ],
                components: []
            })
        })
    }
}