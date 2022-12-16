const { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, Client, ChannelType } = require("discord.js")
const DB = require("../../Structures/Schemas/reportChannel")//fix the paths accordingly

module.exports = {
    name: "setup-report",
    description: "Setup the server's report log channel",
    category: "Utility",
    options: [
        {
            name: "choice",
            description: "Setup or reset the channel",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "Setup",
                    value: "setup"
                },
                {
                    name: "Reset",
                    value: "reset"
                }
            ],
            required: true
        },
        {
            name: "channel",
            description: "Select the channel",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: false
        }
    ],
    UserPerms: ["ManageGuild"],

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        const { options, guild, channel } = interaction

        const Channel = options.getChannel("channel") || channel
        const Choice = options.getString("choice")


        switch (Choice) {

            case "setup": {

                let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

                if (!Data) {

                    Data = new DB({
                        Guild: guild.id,
                        Channel: Channel.id,
                    })

                    await Data.save()

                } else {

                    Data.Channel = Channel.id
                    await Data.save()
                }

                const Embed = new EmbedBuilder()

                interaction.reply({
                    embeds: [Embed.setColor("Blue").setDescription(`The report log channel has been set to ${Channel}`)]
                })

            }
                break;

            case "reset": {

                let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

                const Embed = new EmbedBuilder()

                if (!Data) return interaction.reply({
                    embeds: [Embed.setColor("DarkRed").setDescription(`No data could be found`)]
                })

                await DB.deleteOne({ Guild: guild.id }).catch(err => { })

                interaction.reply({
                    embeds: [Embed.setColor("Blue").setDescription(`Report log channel has been reset`)]
                })
            }
                break;
        }
    }
}