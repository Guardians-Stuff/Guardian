const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearchannel")
    .setDescription("Clear all messages in the channel")
    .setDMPermission(false),

  async execute(interaction) {
    // check if user has permission to use the command
    if (
      !interaction.member.permissions.has(PermissionsBitField.ManageMessages)
    ) {
      return interaction.reply({
        content: "you do not have permission to use this command.",
        ephemeral: true, // only visible to the user who executed the command
      });
    }

    // defer the reply to reduce API overhead
    await interaction.deferReply({ ephemeral: true });

    // get the channel and initialize a counter for deleted messages
    const channel = interaction.channel;
    let deletedSize = 0;

    // loop through messages and delete them in batches of 100
    while (true) {
      const fetchedMessages = await channel.messages.fetch({ limit: 100 });
      if (fetchedMessages.size === 0) break;

      const deletedMessages = await channel.bulkDelete(fetchedMessages, true);
      if (deletedMessages.size === 0) break;

      deletedSize += deletedMessages.size;
    }

    return interaction.followUp({
      content: `successfully deleted **${deletedSize}** messages in this channel.`,
    });
  },
};