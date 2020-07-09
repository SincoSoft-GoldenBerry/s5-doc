import { StantardElement } from './standard/standard-element.js';
import { VersionModel } from '../../model/version-model.js';
import { AppUrls } from '../enums/app-urls.js';

export class Components extends StantardElement {
    static get attributes() {
        return {
            'component': '_renderBody',
            'menu': '_renderTitle'
        };
    }

    static get tag() {
        return 'app-components';
    }

    static get observedAttributes() { 
        return Object.keys(Components.attributes);
    }

    set component(value) {
        this._component = value;
        this._renderBody();
    }

    get component() {
        return this._component;
    }

    set menu(value) {
        this._menu = value;
        this._renderTitle();
    }

    get menu() {
        return this._menu;
    }

    constructor() {
        super();
        this._defineShadow();
        this._initVariables();
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this['_'+attr] = newValue;
        const fn = Components.attributes[attr];
        fn && this[fn]();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('component-container');
        this.wrapper.innerHTML = `
            <section id="component-title">
                <h2></h2>
                <button type="button" class="descarga success"><i class="fas fa-download"></i></button>
            </section>
            <section id="component-body">
                <i class="rotate-infinite fas fa-spinner"></i>
            </section>
        `;

        const css = document.createElement('style');
        css.innerHTML = `
        @import "css/fa/css/all.min.css";

        @keyframes rotating {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        ${StantardElement.standardCss}
        ${StantardElement.standardStickyCss}
        ${StantardElement.standardCssBtn}

        .rotate-infinite {
            animation: rotating 1s linear infinite;
        }

        .component-container {
            display: flex;
            flex-flow: column nowrap;
            padding: 0 30px;
        }

        #component-title {
            padding: 20px 0;
            margin-bottom: 0.7em;
            border-bottom: 1px solid #ddd;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            align-content: center;
            background-color: var(--body-bgcolor);
        }
        #component-title h2 {
            margin: 0;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    _renderTitle() {
        this.$title.textContent = `Componente: ${this._menu}`;
        document.title = `Componentes - ${this._menu} - By: GoldenBerry`;
    }

    _getUrlVersion() {
        const ret = {
            url: null,
            version: null
        };

        if (/v2/i.test(this._component)){
            ret.url = `${AppUrls.cdn.base}@${this._v2}/${this._component}.js`;
            ret.version = this._v2;
        }
        else {
            ret.url = `${AppUrls.cdn.base}@${this._v1}/${this._component}.js`;
            ret.version = this._v1;
        }

        return ret;
    }

    async _renderBody() {
        const { version, url } = this._getUrlVersion();

        this._appendDownloadButton(version, url);
        this._appendComponent();
    }

    async _appendDownloadButton(version, url) {
        const { files } = await this.versionModel.getVersion(version);

        if (files.some(f => f === `${this._component}.js`)) {
            this.$buttom.classList.remove('hide');
            this.$buttom.title = `Descargar ${this._component}`;

            this._initEvents(url);
        }
        else {
            this.$buttom.classList.add('hide');
        }
    }

    _initEvents(url) {
        this.$buttom.addEventListener('click', () => window.open(url, '_blank'));
    }

    _getName() {
        return this._component.replace(/s5\./i, '');
    }

    async _appendComponent() {
        this.$loader.delete();

        s5(`<app-${this._getName()}>`)
            .addEvent('loadend', () => this.dispatchCustomEvent(this.wrapper))
            .insertTo(this.$body);
    }

    _initVariables() {
        const { v1, v2 } = window['app-version'];
        this._v1 = v1;
        this._v2 = v2;

        this.versionModel = new VersionModel();

        this.$loader = s5(this.wrapper.querySelector('i.rotate-infinite'));
        this.$title = this.wrapper.querySelector('h2');
        this.$body = this.wrapper.querySelector('#component-body');
        this.$buttom = this.wrapper.querySelector('button');

        this._component = '';
    }
}