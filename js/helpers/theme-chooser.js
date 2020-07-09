import { Cookies } from './cookies.js';

export class ThemeChooser {
    constructor() {
        this.cookie = new Cookies();
        this.$metas = document.querySelectorAll('.meta-theme');
        this.color = '#f8f8f8';
    }

    _comparer(hash) {
        return hash.includes('theme');
    }

    _getHashes() {
        return window.location.hash.split('#');
    }

    _extractModeFromHash(hashes) {
        return hashes.find(comparer).split('=')[1];
    }

    _redirectWithoutHash(mode) {
        window.location.href = window.location.href
                                .replace(`#theme=${mode}`, '')
                                .replace(`%23theme=${mode}`, '');
    }

    _readCookie() {
        return this.cookie.read('view') || 'light';
    }

    _writeCookie(mode) {
        this.cookie.write('view', mode);
    }

    _addClassToBody(name) {
        document.body.classList.add(name);
    }

    _changeUrlThemeCss() {
        document.head.querySelector('#theme').href = 'css/variables/dark.css';
    }

    _setAttributeToMetas() {
        this.$metas.forEach(meta => meta.setAttribute('content', this.color));
    }

    init() {
        let mode = this._readCookie();
        const hashes = this._getHashes();
        if (hashes.some(this._comparer)) {
            mode = this._extractModeFromHash(hashes);
            this._writeCookie(mode);
            this._redirectWithoutHash(mode);
            return false;
        }
        document.body.className = '';
        this._addClassToBody(mode);
        if (mode === 'light') {
            this._writeCookie('light');
        }
        else {
            this._changeUrlThemeCss();
            this.color = '#0a0a0a';
        }
        this._setAttributeToMetas();
        return true;
    }
}