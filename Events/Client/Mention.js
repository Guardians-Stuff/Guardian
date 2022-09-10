const {
    Client,
    Message,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js")
const ms = require("ms")

module.exports = {
    name: 'messageCreate',

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {

        const {
            author,
            guild,
            content
        } = message
        const {
            user
        } = client

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        return message.reply({

            embeds: [
                new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                    name: user.username,
                    iconURL: user.displayAvatarURL()
                })
                .setDescription(`Hey! Did you ping me by any chance? I'm Guardian, a advanced moderation bot! Type \`/\` & click on my logo to
                    see all my commands!\n\n*This message will be deleted in \`10 seconds\`!*`)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({
                    text: "Guardian - A advanced Discord moderation bot"
                })
                .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/4rztPDANgj")
                    .setLabel("Support Server")

                )
            ]
        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch(err => {

                    if(err.code !== 10008) return console.log(err)
                })
            }, ms("10s"))
        })
    }
}