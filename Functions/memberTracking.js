const Discord = require('discord.js');

const Members = require('../Schemas/Members');

/**
 * @param {Discord.Client} client
 */
async function fetchAllMembers(client){
    const guilds = await client.guilds.fetch().catch(() => null);
    if(!guilds) return await fetchAllMembers(client);

    const fetchedGuilds = [];
    for(const guild of guilds.values()){
        const fetchedGuild = await guild.fetch().catch(e => console.log(e.stack));
        if(fetchedGuild) fetchedGuilds.push(fetchedGuild);
    }

    console.log(`[Member Tracking]: Succesfully fetched ${fetchedGuilds.length}/${guilds.size} guilds`);
    for(const guild of fetchedGuilds) await addGuild(guild);
}

/**
 * @param {Discord.Guild} guild
 */
async function addGuild(guild, retries = 0){
    const members = await guild.members.fetch().catch(e => retries >= 5 && console.log(e.stack));
    if(!members){
        if(retries >= 5) return console.log(`[Member Tracking]: Hit max retries while indexing ${guild.id}, error shown below`);
        return await addGuild(guild, retries + 1);
    }

    const promises = [ ...members.values() ].map(member => Members.updateOne({ member: member.id }, { $addToSet: { guilds: guild.id } }, { upsert: true }));
    await Promise.all(promises);

    console.log(`[Member Tracking]: Added guild ${guild.id} with ${members.size} members`);
}

/**
 * @param {Discord.Guild} guild
 */
async function removeGuild(guild){
    const result = await Members.updateMany({ guilds: { $in: [ guild.id ] } }, { $pull: { guilds: guild.id } });
    console.log(`[Member Tracking]: Removed guild ${guild.id} with ${result.matchedCount} members`);
}

/**
 * @param {Discord.GuildMember} member
 */
async function addMember(member){
    await Members.updateOne({ member: member.id }, { $addToSet: { guilds: member.guild.id } }, { upsert: true });
    console.log(`[Member Tracking]: Added member ${member.id} from guild ${member.guild.id}`);
}

/**
 * @param {Discord.Client} client
 */
async function removeMember(member){
    await Members.updateOne({ member: member.id }, { $pull: { guilds: member.guild.id } }, { upsert: true });
    console.log(`[Member Tracking]: Removed member ${member.id} from guild ${member.guild.id}`);
}

module.exports = {
    fetchAllMembers,
    addGuild,
    removeGuild,
    addMember,
    removeMember
}