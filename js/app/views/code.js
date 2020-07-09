import { StantardElement } from './standard/standard-element.js';
import { AppUrls } from '../enums/app-urls.js';

export class Code extends StantardElement {
    static get attributes() {
        return {
            'component': '_renderTitle',
            'menu': '_renderTitle'
        };
    }

    static get tag() {
        return 'app-code';
    }

    static get observedAttributes() { 
        return Object.keys(Code.attributes);
    }

    set component(value) {
        this._component = value;
        this._renderTitle();
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
        this._addEvents();
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this['_'+attr] = newValue;
        const fn = Code.attributes[attr];
        fn && this[fn]();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('code-container');
        this.wrapper.innerHTML = `
            <section class="code-title">
                <h2></h2>
                <div class="div-descarga">
                    <s5-version title="Versión para descargar"></s5-version>
                    <button type="button" class="descarga success" disabled="disabled"><i class="fas fa-download"></i></button>
                </div>
            </section>
            <section class="code-body">
                <i class="rotate-infinite fas fa-spinner"></i>
                <s5-code></s5-code>
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
        
        .code-container {
            display: flex;
            flex-flow: column nowrap;
            padding: 0 30px;
        }

        .code-title {
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

        .code-title h2 {
            margin: 0;
            flex: 1;
        }

        .div-descarga {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-end;
        }

        .div-descarga > * {
            margin-left: 10px;
            margin-top: 10px;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    _renderTitle() {
        this.$title.textContent = `¡El código! - ${this._menu}`;
        document.title = `¡El código! - ${this._menu} - By: GoldenBerry`;

        this._renderBody();
    }

    _initVariables() {
        const { v1, v2 } = window['app-version'];
        this._v1 = v1;
        this._v2 = v2;

        this._menu = null;

        this.$title = this.wrapper.querySelector('h2');
        this.$button = this.wrapper.querySelector('button');
        this.$loader = s5(this.wrapper.querySelector('i.rotate-infinite'));
        this.$versions = this.wrapper.querySelector('s5-version');
        this.$code = this.wrapper.querySelector('s5-code');

        this._component = null;
    }

    _addEvents() {
        this.$button.addEventListener('click', () => {
            const { selected } = this.$versions;
            const { url: urlDownload } = this._getUrlVersion(selected);
            window.open(urlDownload, '_blank');
        });

        this.$versions.addEventListener('versionslist', () => this.$button.removeAttribute('disabled'));
        this.$code.addEventListener('codeshow', () => {
            this.$loader.delete();
            this.dispatchCustomEvent(this.wrapper);
        });
    }

    _getUrlVersion(v) {
        const ret = {
            url: null,
            version: 'v1'
        };
        if (/v2/i.test(this._component)){
            ret.url = `${AppUrls.cdn.base}@${v || this._v2}/${this._component.split('v2/').join('')}`;
            ret.version = 'v2';
        }
        else {
            ret.url = `${AppUrls.cdn.base}@${v || this._v1}/${this._component}`;
        }
        return ret;
    }

    async _renderBody() {
        if (this._menu && this._component) {
            const { version, url } = this._getUrlVersion();

            this.$versions.file = this._menu;
            this.$versions.show = version;
            this.$versions.mode = document.body.className;

            this._loadCode(url);
        }
    }

    async _loadCode(url) {
        try {
            const { status, data } = await s5.hr.get(url, { contentType: 'text' });
            if (status === 200) {
                this.$code.loadCode(data);
            }
        }
        catch(e) {
            this.$code.loadCode(`// No se puede cargar el recurso: ${url}\n// verifique los mensajes en consola\n// ${JSON.stringify(e)}`)
        }
    }
}