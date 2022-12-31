const Guilds = require('../Schemas/Guilds');

const cache = new Map();

class GuildsManagerVerification{
    /**
     * @param {GuildsManager} parent
     */
    constructor(parent){
        this.parent = parent;
    }

    /**
     * @type {Boolean}
     */
    get enabled(){
        return this.parent.document.verification.enabled;
    }

    /**
     * @param {Boolean} enabled
     */
    set enabled(enabled){
        this.parent.document.verification.enabled = enabled;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'verification.enabled': enabled } }).then(() => null);
    }

    /**
     * @type { null | 'button' | 'command' | 'captcha' }
     */
    get version(){
        return this.parent.document.verification.version;
    }

    /**
     * @param { null | 'button' | 'command' | 'captcha' } version
     */
    set version(version){
        this.parent.document.verification.version = version;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'verification.version': version } }).then(() => null);
    }

    /**
     * @type {String | null}
     */
    get role(){
        return this.parent.document.verification.role;
    }

    /**
     * @param {String | null} role
     */
    set role(role){
        this.parent.document.verification.role = role;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'verification.role': role } }).then(() => null);
    }

    /**
     * @type {String | null}
     */
    get channel(){
        return this.parent.document.verification.channel;
    }

    /**
     * @param {String | null} channel
     */
    set channel(channel){
        this.parent.document.verification.channel = channel;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'verification.channel': channel } }).then(() => null);
    }
}

class GuildsManagerLogs{
    /**
     * @param {GuildsManager} parent
     */
    constructor(parent){
        this.parent = parent;
    }

    // /**
    //  * @type {Boolean}
    //  */
    // get enabled(){
    //     this.parent.document.logs.enabled;
    // }

    // /**
    //  * @param {Boolean} enabled
    //  */
    // set enabled(enabled){
    //     this.parent.document.logs.enabled = enabled;
    //     Guilds.updateOne({ guild: this.parent.id }, { $set: { 'logs.enabled': enabled } }).then(() => null);
    // }

    /**
     * @type {String | null}
     */
    get basic(){
        return this.parent.document.logs.basic;
    }

    /**
     * @param {String | null} basic
     */
    set basic(basic){
        this.parent.document.logs.basic = basic;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'logs.basic': basic } }).then(() => null);
    }

    /**
     * @type {String | null}
     */
    get moderator(){
        return this.parent.document.logs.moderator;
    }

    /**
     * @param {String | null} moderator
     */
    set moderator(moderator){
        this.parent.document.logs.moderator = moderator;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'logs.moderator': moderator } }).then(() => null);
    }
}

class GuildsManagerAutoRole{
    /**
     * @param {GuildsManager} parent
     */
    constructor(parent){
        this.parent = parent;
    }

    /**
     * @type {String | null}
     */
    get member(){
        return this.parent.document.logs.member;
    }

    /**
     * @param {String | null} member
     */
    set member(member){
        this.parent.document.autorole.member = member;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'autorole.member': member } }).then(() => null);
    }

    /**
     * @type {String | null}
     */
    get bot(){
        return this.parent.document.autorole.bot;
    }

    /**
     * @param {String | null} bot
     */
    set bot(bot){
        this.parent.document.autorole.bot = bot;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'autorole.bot': bot } }).then(() => null);
    }
}

class GuildsManagerAntiRaid{
    /**
     * @param {GuildsManager} parent
     */
    constructor(parent){
        this.parent = parent;

        this.lockdown = new GuildsManagerAntiRaidLockdown(this);
    }

    /**
     * @type {Boolean}
     */
    get enabled(){
        return this.parent.document.antiraid.enabled;
    }

    /**
     * @param {Boolean} enabled
     */
    set enabled(enabled){
        this.parent.document.antiraid.enabled = enabled;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.enabled': enabled } }).then(() => null);
    }

    /**
     * @type {Boolean}
     */
    get raid(){
        return this.parent.document.antiraid.raid;
    }

    /**
     * @param {Boolean} enabled
     */
    set raid(raid){
        this.parent.document.antiraid.raid = raid;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.raid': raid } }).then(() => null);
    }

    /**
     * @type {Number}
     */
    get joinAmount(){
        return this.parent.document.antiraid.joinAmount;
    }

    /**
     * @param {Number} joinAmount
     */
    set joinAmount(joinAmount){
        this.parent.document.antiraid.joinAmount = joinAmount;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.joinAmount': joinAmount } }).then(() => null);
    }

    /**
     * @type {Number}
     */
    get joinWithin(){
        return this.parent.document.antiraid.joinWithin;
    }

    /**
     * @param {Number} joinWithin
     */
    set joinWithin(joinWithin){
        this.parent.document.antiraid.joinWithin = joinWithin;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.joinWithin': joinWithin } }).then(() => null);
    }

    /**
     * @type { null | 'kick' | 'ban' }
     */
    get action(){
        return this.parent.document.antiraid.action;
    }

    /**
     * @param { null | 'kick' | 'ban' } action
     */
    set action(action){
        this.parent.document.antiraid.action = action;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.action': action } }).then(() => null);
    }
    
    /**
     * @type {String | null}
     */
    get channel(){
        return this.parent.document.antiraid.channel;
    }

    /**
     * @param {String | null} channel
     */
    set channel(channel){
        this.parent.document.antiraid.channel = channel;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.channel': channel } }).then(() => null);
    }
}

class GuildsManagerAntiRaidLockdown{
    /**
     * @param {GuildsManagerAntiRaid} parent
     */
    constructor(parent){
        this.parent = parent;
    }

    /**
     * @type {Boolean}
     */
    get enabled(){
        return this.parent.parent.document.antiraid.lockdown.enabled;
    }

    /**
     * @param {Boolean} enabled
     */
    set enabled(enabled){
        this.parent.parent.document.antiraid.lockdown.enabled = enabled;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.lockdown.enabled': enabled } }).then(() => null);
    }

    /**
     * @type {Boolean}
     */
    get active(){
        return this.parent.parent.document.antiraid.lockdown.active;
    }

    /**
     * @param {Boolean} active
     */
    set active(active){
        this.parent.parent.document.antiraid.lockdown.active = active;
        Guilds.updateOne({ guild: this.parent.id }, { $set: { 'antiraid.lockdown.active': active } }).then(() => null);
    }
}

class GuildsManager{
    /**
     * @param {string} id
     */
    constructor(id){
        this.id = id;

        this.verification = new GuildsManagerVerification(this);
        this.logs = new GuildsManagerLogs(this);
        this.autorole = new GuildsManagerAutoRole(this);
        this.antiraid = new GuildsManagerAntiRaid(this);
    }

    /**
     * @param {String} id
     */
    static async fetch(id){
        return await new GuildsManager(id)._fetch();
    }

    async _fetch(){
        this.document = cache.get(this.id) || await Guilds.findOne({ guild: this.id }) || await Guilds.create({ guild: this.id });
        cache.set(this.id, this.document);
        return this;
    }
}

module.exports = { GuildsManager };