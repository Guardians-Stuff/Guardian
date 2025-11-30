const Discord = require('discord.js');

const { GuildsManager } = require('../Classes/GuildsManager');

/**
 * @param {Discord.Client} client
 */
async function fetchAllMembers(client) {
    const guilds = await client.guilds.fetch().catch(() => null);
    if (!guilds) return await fetchAllMembers(client);

    const fetchedGuilds = [];
    for (const guild of guilds.values()) {
        const fetchedGuild = await guild.fetch().catch((e) => console.log(e.stack));
        if (fetchedGuild) fetchedGuilds.push(fetchedGuild);
    }

    console.log(
        `[Member Tracking]: Succesfully fetched ${fetchedGuilds.length}/${guilds.size} guilds`
    );
    for (const guild of fetchedGuilds) await addGuild(guild);
}

/**
 * @param {Discord.Guild} guild
 */
async function addGuild(guild, retries = 0) {
    const members = await guild.members.fetch().catch((e) => retries >= 5 && console.log(e.stack));
    if (!members) {
        if (retries >= 5)
            return console.log(
                `[Member Tracking]: Hit max retries while indexing ${guild.id}, error shown below`
            );
        return await addGuild(guild, retries + 1);
    }

    const dbGuild = await GuildsManager.fetch(guild.id);
    dbGuild.members = [...members.keys()];

    console.log(`[Member Tracking]: Added guild ${guild.id} with ${members.size} members`);
}

/**
 * @param {Discord.Guild} guild
 */
async function removeGuild(guild) {
    const dbGuild = await GuildsManager.fetch(guild.id);
    console.log(
        `[Member Tracking]: Removed guild ${guild.id} with ${dbGuild.members.length} members`
    );

    guild.members = [];
}

/**
 * @param {Discord.GuildMember} member
 */
async function addMember(member) {
    const dbGuild = await GuildsManager.fetch(member.guild.id);
    if (!dbGuild.members.includes(member.id)) dbGuild.members.push(member.id);

    console.log(`[Member Tracking]: Added member ${member.id} from guild ${member.guild.id}`);
}

/**
 * @param {Discord.GuildMember} member
 */
async function removeMember(member) {
    const dbGuild = await GuildsManager.fetch(member.guild.id);
    dbGuild.members = dbGuild.members.filter((id) => id !== member.id);

    console.log(`[Member Tracking]: Removed member ${member.id} from guild ${member.guild.id}`);
}

module.exports = {
    fetchAllMembers,
    addGuild,
    removeGuild,
    addMember,
    removeMember,
};
