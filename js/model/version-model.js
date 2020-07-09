import { Database } from './database.js';

export class VersionModel {
    get storeName() {
        return 's5-versions';
    }

    constructor() {
        this.versions = [];
        this.db = null;
    }

    async _dbConnection() {
        if (!this.db)
            this.db = await new Database().open();
    }

    async getVersion(version) {
        await this._dbConnection();
        return this._encapsulate(await this.db.get(this.storeName, 'version', version));
    }

    async getAllVersions() {
        await this._dbConnection();
        const data = await this.db.getAll(this.storeName);
        return data.map(this._encapsulate);
    }

    async registerVersion(newVersion) {
        await this._dbConnection();
        await this.db.insert(this.storeName, newVersion);
    }

    async registerVersions(listVersions) {
        await this._dbConnection();
        listVersions.forEach(this.registerVersion);
    }

    _encapsulate({ version, files, id }) {
        return new VersionField(version, files, id);
    }
}

export class VersionField {
    constructor(version = null, files = [], id = null) {
        if (id)
            this.id = id;
        this.version = version;
        this.files = files;
    }
}