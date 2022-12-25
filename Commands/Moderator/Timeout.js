const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/Infractions")
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Restrict a member's ability to communicate.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("target")
            .setDescription("Select the target.")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("duration")
            .setDescription("Provide a time for this timeout. (1s, 1m, 1h, 1d)")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Provide a reason.")
            .setMaxLength(512)
        ),
    async execute(interaction) {
        const { options, guild, member } = interaction

        const target = options.getMember("target")
        const duration = options.getString("duration")
        const reason = options.getString("reason") || "No reason provided."

        const errorsArray = []

        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not timeout member due to" })
            .setColor("Red")

        if (!target) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Member has most likely left the server.")],
            ephemeral: true
        })

        if (!ms(duration) || ms(duration) > ms("28d"))
            errorsArray.push("Time provided is invalid or over the 28d limit.")

        if (!target.manageable || !target.moderatable)
            errorsArray.push("Selected target is ot moderateable by this bot.")

        if (member.roles.highest.position < target.roles.highest.position)
            errorsArray.push("Selected member has a higher role position than you.")

        if (errorsArray.length)
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true
            })

        target.timeout(ms(duration), reason).catch((err) => {
            interaction.reply({
                embeds: [errorsEmbed.setDescription("Could not timeout selected target.")]
            })
            return console.log("Error occured in Timeout.js", err)
        })

        const newInfractionsObject = {
            IssuerID: member.id,
            IssuerTag: member.user.tag,
            Reason: reason,
            Date: Date.now()
        }

        let userData = await Database.findOne({ Guild: guild.id, User: target.id })
        if (!userData)
            userData = await Database.create({ Guild: guild.id, User: target.id, Infractions: [newInfractionsObject] })
        else
            userData.Infractions.push(newInfractionsObject) && await userData.save()

        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Timeout issued", iconURL: guild.iconURL() })
            .setColor("Gold")
            .setDescription([
                `${target} was issued a timeout for **${ms(ms(duration), { long: true })}** by ${member}`,
                `Total Infractions: \`${userData.Infractions.length}\``,
                //`bringing their total infractions to **${userData.Infractions.length} points.**`,
                `Reason: \`${reason}\``
            ].join("\n"))
            .setTimestamp()

        return interaction.reply({ embeds: [successEmbed] })

    }
}