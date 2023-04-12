const { Discord, ActivityType } = require("discord.js");

const index = require("../../index.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { fetchAllMembers } = require("../../Functions/memberTracking.js");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Discord.Client} client
   */
  async execute(client) {
    await loadCommands(client);
    await client.expiringDocumentsManager.infractions.init();
    await client.expiringDocumentsManager.giveaways.init();
    await client.expiringDocumentsManager.reminders.init();

    if (process.env.LIVE === "true") {
      process.on("uncaughtException", async (e) =>
        console.log(e.stack || "Unknown Error")
      );
      process.on("unhandledRejection", async (e) =>
        console.log(e.stack || "Unknown Rejection")
      );
    }

    index.server.listen(2053, () => console.log("The client is now ready."));

    // Check if maintenance mode is enabled
    const maintenanceMode = false; // Replace with your own check for maintenance mode
    if (maintenanceMode) {
      // Set bot status to "Maintenance Mode"
      client.user.setPresence({
        activities: [{ name: "Maintenance Mode", type: ActivityType.Watching }],
        status: "dnd",
      });
      // Disable all commands
      client.commands.forEach((command) => {
        command.enabled = false;
      });
      // Return to prevent further execution
      return;
    }

    client.user.setPresence({
      activities: [
        {
          name: `${client.guilds.cache.size} servers!`,
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });

    await fetchAllMembers(client);
  },
};
