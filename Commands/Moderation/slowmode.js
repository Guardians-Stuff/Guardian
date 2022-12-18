const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "slowmode",
	description: "Change the Slowmode.",
	UserPerms: ["ManageChannels"],
    Category: 'Moderation',
	options: [{
		name: "time",
		description: "The time for the slowmode.",
        type: 10,
		required: true,
    }],
	
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { options } = interaction
		
		const Time = options.getNumber("time");

			interaction.channel.setRateLimitPerUser(Time);

		interaction.reply({ content: `The Slowmode of this channel has been set to ${Time}s` });
	}
}