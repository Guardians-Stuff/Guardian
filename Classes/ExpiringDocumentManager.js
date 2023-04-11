const Mongoose = require('mongoose');
const Discord = require('discord.js');

module.exports = class ExpiringDocumentManager {
    /**
     * @param {Mongoose.Model} model
     * @param {string} timeField which field of the document to use as expiration time
     * @param {(document: Mongoose.Document) => Promise<unknown} expiredFunction
     * @param {Mongoose.FilterQuery} query filter which documents are checked
     */
    constructor(model, timeField, expiredFunction, query) {
        this.model = model;
        this.timeField = timeField;
        this.expiredFunction = expiredFunction;
        this.query = query;

        /** @type {Array<Mongoose.Document>} */ this.documents = [];
    }

    async init() {
        // fetch all documents matching the given query, make sure they aren't permenant and sort by expiration
        this.documents = await this.model
            .find({ ...this.query, [this.timeField]: { $ne: Infinity } })
            .sort({ [this.timeField]: 1 });

        this.checkTimeout = this.checkForExpired(); // start the checking loop
        await this.checkTimeout; // this is done so that checkTimeout is a Promise, we should wait until we finished checking to add/remove/update a document
    }

    /**
     * @private
     * @returns {Promise<NodeJS.Timeout | null>}
     */
    async checkForExpired() {
        const executionTime = Date.now(); // make sure all comparisons are using the same time
        const expiredDocuments = this.documents.filter(
            (document) => executionTime >= document.get(this.timeField)
        );
        this.documents = this.documents.filter(
            (document) => executionTime < document.get(this.timeField)
        ); // filter out expired documents

        const updatedDocuments = (
            await Promise.all(expiredDocuments.map((document) => this.expiredFunction(document)))
        ) // execute the expired function on each document
            .filter(
                (document) =>
                    document instanceof Mongoose.Document &&
                    document.get(this.timeField) > executionTime
            ); // grab any returned documents that have a new expiration date
        if (updatedDocuments.length > 0) {
            this.documents.push(...updatedDocuments); // add the updated documents back into the check
            this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField)); // resort with new documents
        }

        if (this.documents[0]) {
            if (Date.now() >= this.documents[0].get(this.timeField)) return this.checkForExpired(); // some documents expired while we were checking, recheck
            return setTimeout(() => {
                this.checkTimeout = this.checkForExpired(); // time's up, check em
            }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
        }

        return null;
    }

    /**
     * @param {Mongoose.Document} document
     */
    async addNewDocument(document) {
        if (!document) throw new Error('No document provided');
        this.checkTimeout = await this.checkTimeout; // incase were checking, wait for it to complete

        if (this.checkTimeout) {
            // if we have documents that need to be checked
            if (document.get(this.timeField) - this.documents[0].get(this.timeField) < 0) {
                // if our document expires sooner than the one were waiting for
                clearTimeout(this.checkTimeout);
                this.checkTimeout = null;

                this.documents.unshift(document);
                setTimeout(() => {
                    this.checkTimeout = this.checkForExpired(); // time's up, check em
                }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
            } else {
                this.documents.push(document);
                this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField));
            }
        } else {
            this.documents.push(document);
            setTimeout(() => {
                this.checkTimeout = this.checkForExpired(); // time's up, check em
            }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
        }
    }

    /**
     * @param {Mongoose.Document} document
     */
    async updateDocument(document) {
        if (!document) throw new Error('No document provided');
        if (this.documents.filter((doc) => doc.id == document.id).length == 0)
            return this.addNewDocument(document);

        this.checkTimeout = await this.checkTimeout; // incase were checking, wait for it to complete
        if (this.checkTimeout) {
            // if we have documents that need to be checked
            if (this.documents[0].id == document.id) {
                // if the updated document is the one were waiting for, expiration time might be different
                clearTimeout(this.checkTimeout);
                this.checkTimeout = null;

                this.documents = [
                    document,
                    ...this.documents.filter((doc) => doc.id != document.id),
                ]; // replace the old document with the new one
                this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField));
                setTimeout(() => {
                    this.checkTimeout = this.checkForExpired(); // time's up, check em
                }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
            } else {
                this.documents = [
                    ...this.documents.filter((doc) => doc.id != document.id),
                    document,
                ]; // replace the old document with the new one
                this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField));
                setTimeout(() => {
                    this.checkTimeout = this.checkForExpired(); // time's up, check em
                }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
            }
        } else {
            // we should never reach here(in theory), if were not waiting on any documents then the addNewDocument check earlier would've caught it
            this.documents.push(document);
            setTimeout(() => {
                this.checkTimeout = this.checkForExpired(); // time's up, check em
            }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
        }
    }

    /**
     * @param {Mongoose.Document} document
     */
    async removeDocument(document) {
        if (!document) throw new Error('No document provided');
        if (this.documents.filter((doc) => doc.id == document.id).length == 0) return;

        this.checkTimeout = await this.checkTimeout; // incase were checking, wait for it to complete
        if (this.checkTimeout && this.documents[0].id == document.id && this.documents[1]) {
            // if we have documents that need to be checked, were waiting on the document removed and we have more documents
            clearTimeout(this.checkTimeout);
            this.checkTimeout = null;

            setTimeout(() => {
                this.checkTimeout = this.checkForExpired(); // time's up, check em
            }, Math.min(2147483647, this.documents[0].get(this.timeField) - Date.now())); // wait until the next document expires, or max safe 32bit integer in milliseconds (25~ days)
        }

        this.documents = this.documents.filter((doc) => doc.id != document.id);
    }
};

// originally written in typescript for different project
/*

import Mongoose from 'mongoose';
import Discord from 'discord.js';

export default class<T extends Mongoose.Document>{
    private model: Mongoose.Model<T>;
    private timeField: Exclude<keyof T, keyof Mongoose.Document | number | symbol>;
    private expiredFunction: (document: T, guild: Discord.Guild) => Promise<unknown>;
    private documents: Array<T>;
    private query: Mongoose.FilterQuery<T>;
    private checkTimeout: null | NodeJS.Timeout | Promise<NodeJS.Timeout | null> = null;
    private guild!: Discord.Guild;

    constructor(model: Mongoose.Model<T>, timeField: Exclude<keyof T, keyof Mongoose.Document | number | symbol>, expiredFunction: (document: T, guild: Discord.Guild) => Promise<unknown>, query: Mongoose.FilterQuery<T> = {}){
        this.model = model;
        this.timeField = timeField;
        this.expiredFunction = expiredFunction;
        this.documents = [];
        this.query = query;
    }

    public async init(guild: Discord.Guild): Promise<void>{
        this.guild = guild;
        this.documents = await this.model.find({ ...this.query, [this.timeField]: { $ne: Infinity } }).sort({ [this.timeField]: 1 });
        this.checkTimeout = this.checkForExpired();
        await this.checkTimeout;
    }

    public async checkForExpired(): Promise<NodeJS.Timeout | null>{
        const executionTime = new Date().valueOf();
        const expiredDocuments = this.documents.filter(document => executionTime >= document.get(this.timeField));
        this.documents = this.documents.filter(document => executionTime < document.get(this.timeField));

        const updatedDocuments = (await Promise.all(expiredDocuments.map(document => this.expiredFunction(document, this.guild)))).filter(document => document instanceof Mongoose.Document && document.get(this.timeField) > executionTime) as Array<T>;
        if(updatedDocuments.length > 0){
            this.documents.push(...updatedDocuments);
            this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField));
        }

        if(this.documents[0]){
            if(new Date().valueOf() >= this.documents[0].get(this.timeField)) return this.checkForExpired();
            return setTimeout(() => this.checkTimeout = this.checkForExpired(), Math.min(2147483647, this.documents[0].get(this.timeField) - new Date().valueOf()));
        }

        return null;
    }

    public async addNewDocument(document: T | null): Promise<void>{
        if(!document) return;
        this.checkTimeout = await this.checkTimeout;

        if(this.checkTimeout){
            if(document.get(this.timeField) - this.documents[0].get(this.timeField) < 0){
                clearTimeout(this.checkTimeout);
                this.checkTimeout = null;

                this.documents.unshift(document);
                this.checkTimeout = setTimeout(() => this.checkTimeout = this.checkForExpired(), Math.min(2147483647, this.documents[0].get(this.timeField) - new Date().valueOf()));
            }else{
                this.documents.push(document);
                this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField));
            }
        }else{
            this.documents.push(document);
            this.checkTimeout = setTimeout(() => this.checkTimeout = this.checkForExpired(), Math.min(2147483647, this.documents[0].get(this.timeField) - new Date().valueOf()));
        }
    }

    public async updateDocument(document: T | null): Promise<void>{
        if(!document) return;
        if(this.documents.filter(doc => doc.id == document.id).length == 0) return this.addNewDocument(document);

        this.checkTimeout = await this.checkTimeout;
        if(this.checkTimeout){
            if(this.documents[0].id == document.id){
                clearTimeout(this.checkTimeout);
                this.checkTimeout = null;

                this.documents = [ document, ...this.documents.filter(doc => doc.id != document.id) ];
                this.checkTimeout = setTimeout(() => this.checkTimeout = this.checkForExpired(), Math.min(2147483647, this.documents[0].get(this.timeField) - new Date().valueOf()));
            }else{
                this.documents = [ ...this.documents.filter(doc => doc.id != document.id), document ];
                this.documents.sort((a, b) => a.get(this.timeField) - b.get(this.timeField));
            }
        }else{
            this.documents.push(document);
            this.checkTimeout = setTimeout(() => this.checkTimeout = this.checkForExpired(), Math.min(2147483647, this.documents[0].get(this.timeField) - new Date().valueOf()));
        }
    }

    public async removeDocument(document: T | null): Promise<void>{
        if(!document || this.documents.filter(doc => doc.id == document.id).length == 0) return;

        this.checkTimeout = await this.checkTimeout;
        if(this.checkTimeout && this.documents[0].id == document.id && this.documents[1]){
            clearTimeout(this.checkTimeout);
            this.checkTimeout = null;

            this.checkTimeout = setTimeout(() => this.checkTimeout = this.checkForExpired(), Math.min(2147483647, this.documents[1].get(this.timeField) - new Date().valueOf()));
        }

        this.documents = this.documents.filter(doc => doc.id != document.id);
    }
}

*/
