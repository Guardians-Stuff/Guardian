const Discord = require('discord.js');
const ms = require('ms');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Restrict a member's ability to communicate.")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("target")
            .setDescription("Select the target.")
            .setRequired(true)
        ).addStringOption(options => options
            .setName("duration")
            .setDescription("Provide a time for this timeout. (1s, 1m, 1h, 1d)")
            .setRequired(true)
        ).addStringOption(options => options
            .setName("reason")
            .setDescription("Provide a reason.")
            .setMaxLength(512)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const target = interaction.options.getMember("target");
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason") || "Unspecified reason.";

        const errorsArray = []

        if (!target) return { embeds: [ EmbedGenerator.errorEmbed('That user is no longer in the server.') ], ephemeral: true };
        if (!ms(duration) || ms(duration) > ms("28d")) errorsArray.push("Time provided is invalid or over the 28d limit.")
        if (!target.manageable || !target.moderatable) errorsArray.push("Selected target is not moderateable by this bot.")
        if (interaction.member.roles.highest.position < target.roles.highest.position) errorsArray.push("Selected member has a higher role position than you.")
        if (errorsArray.length) return { embeds: [ EmbedGenerator.errorEmbed(errorsArray.join('\n')) ], ephemeral: true };

        target.timeout(ms(duration), reason).catch((err) => {
            interaction.reply({
                embeds: [ EmbedGenerator.errorEmbed('Could not timeout selected target.') ]
            })
            return console.log("Error occured in Timeout.js", err)
        })

        await Infractions.create({
            guild: interaction.guild.id,
            user: target.id,
            issuer: interaction.user.id,
            type: 'timeout',
            reason: reason,
            duration: ms(duration)
        });
        
        return EmbedGenerator.basicEmbed()
            .setAuthor({ name: "Timeout issued", iconURL: interaction.guild.iconURL() })
            .setDescription([
                `${target} was issued a timeout for **${ms(ms(duration), { long: true })}** by ${interaction.member}`,
                `Total Infractions: \`${(await Infractions.find({ guild: interaction.guild.id, user: target.id })).length}\``,
                //`bringing their total infractions to **${userData.Infractions.length} points.**`,
                `Reason: \`${reason}\``
            ].join("\n"))
            .setTimestamp()
    }
}