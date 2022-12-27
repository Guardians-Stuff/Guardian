const Discord = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Discord.Interaction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        let executeFunction;

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: 'This command is outdated.', ephemeral: true });
        executeFunction = command.execute;

        if (command.developer && interaction.user.id !== "1049140383122194452")
            return interaction.reply({
                content: "This command is only available to the developer.",
                ephemeral: true
            });

        const subCommand = interaction.options.getSubcommand(false);
        if (subCommand) {
            const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
            if (!subCommandFile) return interaction.reply({ content: "This sub command is outdated.", ephemeral: true });

            executeFunction = subCommandFile.execute;
        }

        const response = await executeFunction(interaction, client);
        if(response){
            const parsedResponse = {
                content: response.content || null,
                embeds: response.embeds || [],
                ephemeral: response.ephemeral || false
            };

            if(response instanceof Discord.EmbedBuilder) parsedResponse.embeds.push(response);
            if(response instanceof String) parsedResponse.content = response;

            if(interaction.replied || interaction.deferred){
                interaction.editReply(parsedResponse);
            }else{
                interaction.reply(parsedResponse);
            }
        }
    }
}