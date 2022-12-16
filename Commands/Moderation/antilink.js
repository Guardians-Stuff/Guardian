const { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ChatInputCommandInteraction } = require("discord.js")
const antilinkSchema = require('../../Structures/Schemas/AntilinkDB');

module.exports = {
    name: "antilink",
    description: "Prevent users from sending link on the server.",
    UserPerms: ["Administrator"],
    category: "Administration",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

    const guild = interaction.guild;

    await interaction.deferReply();

    let requireDB = await antilinkSchema.findOne({ _id: guild.id })

    const sistema = requireDB?.logs === true ? '📗 Activated' : '📕 Disabled';

    const e2 = new EmbedBuilder()
    .setTitle(`🔗 Antilink`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor('Random')
    .setDescription(`Antilink from ${guild.name}\n\nThe system is currently \`${sistema}\`.\nUse the button below to configure the server antilink!!`)
    .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
    .setTimestamp(new Date())

    const b = new ButtonBuilder()
    .setLabel(`Activate`)
    .setCustomId(`true`)
    .setStyle(3)
    .setEmoji(`📗`)

    const b1 = new ButtonBuilder()
    .setLabel(`Disable`)
    .setCustomId(`false`)
    .setStyle(4)
    .setEmoji(`📕`)

    const ac = new ActionRowBuilder().addComponents(b, b1)

    const tf = await interaction.editReply({ embeds: [e2], components: [ac] })

    const coll = tf.createMessageComponentCollector();

    coll.on('collect', async(ds) => {

        if(ds.user.id !== interaction.user.id) return;

        if(ds.customId === `true`) {

        const e = new EmbedBuilder()
        .setDescription(`📗 Antilink system has been set to **Active**!`)
        .setColor('Green')
        
        ds.update({ embeds: [e], components: [] })

        await antilinkSchema.findOneAndUpdate({ _id: guild.id }, {
            $set: { logs: true }
          }, { upsert: true })

        } 

        else

        if(ds.customId === `false`) {

        const e = new EmbedBuilder()
        .setDescription(`📕 Antilink system has been set to **Disabled**!`)
        .setColor('Red')
            
        ds.update({ embeds: [e], components: [] })

        await antilinkSchema.findOneAndUpdate({ _id: guild.id }, {
            $set: { logs: false }
          }, { upsert: true })

        }

    })

    }
}