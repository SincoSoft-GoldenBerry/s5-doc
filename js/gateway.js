import * as CustomComponents from './app/custom-components-definer.js';
import { App } from './app/app.js';
import { VersionLoader } from './helpers/version-loader.js';
import { ThemeChooser } from './helpers/theme-chooser.js';
import { Register } from './helpers/register.js';

class Gateway {
    constructor() {
        this._s5loaded = false;
        this._bodyloaded = false;
    }

    init() {
        CustomComponents.register();

        window.waitForGlobal('s5').then(() => s5.initialize(['request.min', 'icons.min', 'autocomplete.min', 'dragdrop.min'], () => this._initWithS5(), 'js'));

        window.waitForGlobal('document.body').then(() => this._initWithBody());
    }

    _initWithS5() {
        this._s5loaded = true;
        new Register().init();
        new VersionLoader(() => this._initApp()).init();
    }

    _initWithBody() {
        this._bodyloaded = new ThemeChooser().init();
        this._initApp();
    }

    async _initApp() {
        if (this._bodyloaded && this._s5loaded) {
            await window.waitForGlobal('app-version');
            s5('.content').shift().insert(document.createElement(App.tag));
        }
    }
}

const gateway = new Gateway();
gateway.init();
