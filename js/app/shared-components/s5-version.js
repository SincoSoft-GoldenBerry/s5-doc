import { VersionModel } from '../../model/version-model.js';

export class Version extends HTMLElement {
    static get attributes() {
        return {
            'show': null,
            'mode': '_setMode',
            'file': '_setFile'
        };
    }

    static get tag() {
        return 's5-version';
    }

    get selected() {
        return this.wrapper.value;
    }

    get show() {
        return this._show;
    }

    set show(value) {
        this._show = value;
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;
        this._setMode();
    }

    get file() {
        return this._file;
    }

    set file(value) {
        this._file = value;
        this._setFile();
    }

    constructor() {
        super();
        this._loaded = false;
        this._defineShadow();
    }

    static get observedAttributes() { 
        return Object.keys(Version.attributes);
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this['_'+attr] = newValue;
        const fn = Version.attributes[attr];
        fn && this[fn]();
    }

    _setMode(){
        this.wrapper.classList.add(this._mode);
        this._render();
    }

    _setFile() {
        this._file = this._file.split(' ').shift();
        this._render();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('select');

        const css = document.createElement('style');
        css.innerHTML = `
        * {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            transition: all ease .2s;
        }

        select {
            height: 100%;
            box-sizing: border-box;
            border-radius: 5px;
            outline: none;
            cursor: pointer;
            background-color: transparent;
            border-color: rgba(0, 0, 0, 0.1);
            color: #333333;
        }

        select.dark {
            color: #FFFFFF;
            border-color: rgba(250, 250, 250, 0.1);
        }

        select.light:hover,
        select.light:active,
        select.light:focus {
            border-color: rgba(0, 0, 0, 0.2);
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
        }

        select.dark:hover,
        select.dark:active,
        select.dark:focus {
            border-color: rgba(250, 250, 250, 0.2);
            box-shadow: 0px 0px 5px 0px rgba(125, 125, 125, 0.2);
        }

        option {
            color: black;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    connectedCallback() {
        this._render();
    }

    async _render() {
        this.wrapper.innerHTML = '<option value="-1">Cargando...</option>';

        this._listVersions();
    }

    async _listVersions() {
        if (this.show && this.file && this.mode && !this._loaded) {
            this._loaded = true;
            try {
                const versionModel = new VersionModel();
                const versions = await versionModel.getAllVersions();

                this.wrapper.innerHTML = '';
                
                const r = t => t.replace(/[^\d]/g, '');
                const f = r(this.show);

                this._showResults(
                    versions
                        .filter(({ version, files }) => version.startsWith(f) && files.includes(this.file))
                        .map(({ version }) => version)
                        .sort((a, b) => {
                            a = parseInt(r(a.split('-').shift()));
                            b = parseInt(r(b.split('-').shift()));
                            return b-a;
                        })
                );
            }
            catch (e) {
                this.wrapper.innerHTML = '';
                console.log('Error al consultar las versiones:', e);
                s5('<option>', { 'value': '-1' }).insert(document.createTextNode('--')).insertTo(this.wrapper);
            }
        }
    }

    _showResults(versions) {
        versions.forEach(v => s5('<option>', { 'value': v }).insert(document.createTextNode(v)).insertTo(this.wrapper));

        const event = new Event('versionslist', { bubbles: true });
        this.dispatchEvent(event);
    }
}