import { VersionModel, VersionField } from '../model/version-model.js';
import { AppUrls } from '../app/enums/app-urls.js'

export class VersionLoader {
    constructor(onVersionLoaded) {
        this.versionModel = new VersionModel();
        this._counter = 0;
        this._onVersionLoaded = onVersionLoaded || (() => {});
    }

    async init(){
        const versions = await this._getData();
        const existingVersions = await this._getAllVersions();

        if (versions !== null && existingVersions !== null) {
            const missingVersions = this._filterData(existingVersions, versions);
            this._counter = missingVersions.length;
            if (this._counter > 0) {
                this._getMissingData(missingVersions);
            }
            else {
                this._onVersionLoaded();
            }
        }
    }

    async _getData() {
        try {
            const { status, data } = await s5.hr.get(AppUrls.cdn.API.url, AppUrls.cdn.API.type);
            if (status === 200) {
                const { versions } = JSON.parse(data);
                return versions;
            }
        }
        catch(e) {
            console.log('Error al consultar las versiones:', e);
        }
        return null;
    }

    async _getAllVersions() {
        try {
            return await this.versionModel.getAllVersions();
        }
        catch(e) {
            console.log('Error al consultar las versiones en VersionModel:', e);
        }
        return null;
    }

    _filterData(existingVersions, versions) {
        return versions.filter(v => !existingVersions.some(e => e.version === v));
    }

    _getMissingData(missingVersions) {
        missingVersions.forEach(version => 
            s5.hr.get(AppUrls.cdn.API.fnUrl(version), AppUrls.cdn.API.type)
                .then(({ url, data }) => this._registerVersion(this._formatVersionNumber(url), this._formatDataToFiles(data)))
                .catch(e => console.log('Error al consultar los archivos de la versión:', e))
        );
    }

    _formatVersionNumber(url) {
        return url.replace(/^.*@/, '');
    }

    _formatDataToFiles(data) {
        return JSON.parse(data).files.map(f => f.name);
    }

    async _registerVersion(versionNumber, files) {
        const missingVersion = new VersionField(versionNumber, files);
        await this.versionModel.registerVersion(missingVersion);
        this._counter--;
        if (this._counter === 0) {
            this._onVersionLoaded();
        }
    }
}