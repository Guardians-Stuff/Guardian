const Users = require('../Schemas/Users');

const cache = new Map();

class UsersManager {
    /**
     * @param {String} id
     * @param {String} guild
     */
    constructor(id, guild) {
        this.id = id;
        this.guild = guild;
    }

    /**
     * @param {String} id
     */
    static async fetch(id, guild) {
        return await new UsersManager(id, guild)._fetch();
    }

    async _fetch() {
        this.document =
            cache.get(`${this.id}-${this.guild}`) ||
            (await Users.findOne({ user: this.id, guild: this.guild })) ||
            (await Users.create({ user: this.id, guild: this.guild }));
        cache.set(`${this.id}-${this.guild}`, this.document);
        return this;
    }

    /**
     * @type {String}
     */
    get captcha() {
        return this.document.captcha;
    }

    /**
     * @param {String} captcha
     */
    set captcha(captcha) {
        this.document.captcha = captcha;
        Users.updateOne({ user: this.id, guild: this.guild }, { $set: { captcha: captcha } }).then(
            () => null
        );
    }
}

module.exports = { UsersManager };
