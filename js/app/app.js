import { Cookies } from '../helpers/cookies.js';

export class App extends HTMLElement {
    static get tag() {
        return 'app-content';
    }

    constructor() {
        super();
        this._defineShadow();
        this._addTouchStartEvent();
        this._initVariables();
    }

    connectedCallback() {
        this._initConfig();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('aside');
        this.wrapper.innerHTML = `
        <div style="padding: 50px 30px; font-size: 1.2em;">
            Cargando contenido...
        </div>
        `;

        const css = document.createElement('style');
        css.innerHTML = `
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    _initVariables() {
        this._currentMode = document.body.className;
        
        this.$header = s5(document.querySelector('app-header'));
        this.$header.currentMode = this._currentMode;

        //old
        this.$footer = s5('footer.bottom').shift();
        this.$modal = s5('modal');
        this.$years = s5('.year');

        this.$component = null;

        this.cookie = new Cookies();
    }

    _writeCookie(mode) {
        this.cookie.write('view', mode);
    }

    async _addTouchStartEvent() {
        document.addEventListener('touchstart', () => { }, { passive: true });
    }

    async _setYear() {
        const year = new Date().getFullYear();
        this.$years.forEach(el => el.innerHTML = year);
    }

    async _setModeEvent() {
        s5('a[mode]').addEvent('click', e => {
            const mode = e.target.getAttribute('mode');
            this._writeCookie(mode);
            window.location.reload();
        });
    }

    async _addClassToSelectedMenu() {
        s5('.nav-link[mode]').forEach(t => {
            if (t.attribute('mode') === this._currentMode) {
                t.parentNode.classList.add('theme');
            }
            else {
                t.parentNode.classList.remove('theme');
            }
        });
    }

    async _setIconSelectedMode() {
        s5('.current-theme').forEach(themeIcon => {
            themeIcon.className = '';
            themeIcon.className = `fa fa-${this._currentMode === 'dark' ? 'moon' : 'sun'}`;

            themeIcon.parentNode.setAttribute('title', `Tema actual: ${this._currentMode}`);
        });
    }

    async _setEventForNavigation() {
        this._navigate();
        s5.addEvent.call(window, 'hashchange', () => this._navigate());
    }

    _cleanWrapper() {
        this.wrapper.innerHTML = '';
        this.$modal.close();
    }

    _getOption() {
        return window.location.hash || '#index';
    }

    _getModuleName(option) {
        return option.shift().replace('#', '');
    }

    _getModuleComponent(option) {
        return option.shift();
    }

    async _navigate() {
        this._cleanWrapper();

        let option = this._getOption();

        this.$header.currentMenu = option;
        this.$header.hideMenu();

        option = option.split('-');

        const moduleName = this._getModuleName(option);
        const component = this._getModuleComponent(option);

        this.$component = s5(`<app-${moduleName}>`, { 'component': component })
                            .addEvent('loadend', ({ container }) => {
                                this._stickyTitle(container);
                                this._loadEnd();
                            })
                            .insertTo(this.wrapper);
        this._setComponentTitle();
    }

    async _stickyTitle(container) {
        container = s5(container);
        container.get(`[class*="title"], [id*="title"]`)
            .forEach(el => el.classList.add('sticky-title'));

        const body = container.get(`[class*="body"], [id*="body"]`).shift();
        if (body)
            body.classList.add('sticky-sibling');
    }

    async _initConfig() {
        this._setYear();
        this._setModeEvent();
        this._addClassToSelectedMenu();
        this._setIconSelectedMode();
        this._setEventForNavigation();
        this._setVersion(window['app-version']);

        this._getMenu();
    }

    async _setComponentTitle() {
        if (this._data) {
            const title = this._getName(this._data, 0);
            if (this.$component) {
                this.$component.menu = title;
            }
        }
    }

    _getName(data, i) {
        if (data.length > i) {
            if (data[i].url === this._getOption())
                return data[i].name;
            if (data[i].sub && data[i].sub.length > 0) {
                const r = this._getName(data[i].sub, 0);
                if (r) return r;
            }
            return this._getName(data, i+1);
        }
        return null;
    }

    async _getMenu() {
        try {
            const { status, data } = await s5.hr.get('menu.json');
            if (status === 200) {
                this._data = data;
                this._setComponentTitle();
                this.$header.loadMenu(data);
            }
        }
        catch(e) {
            console.log('Ocurrió un error al consultar el menu', e);
        }
    }

    _loadEnd() {
        this.$footer.classList.remove('bottom');
    }

    async _setVersion({ v1, v2, app }) {
        s5('.version').forEach(el => el.innerHTML = `versión: ${app}`);
        s5('.v1').forEach(el => el.innerHTML = v1);
        s5('.v2').forEach(el => el.innerHTML = v2);
    }
}