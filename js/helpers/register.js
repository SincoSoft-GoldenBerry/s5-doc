import { AppUrls } from '../app/enums/app-urls.js';

export class Register {
    constructor() {
        this._worker = null;
        this._newWorker = null;
        this.$newVersion = s5('.new-version').shift()
                            ;
    }

    async init() {
        if (window['localhost']) return;
        
        if ('serviceWorker' in navigator) {
            this._worker = await this._registerServiceWorker();
            if (this._worker !== null) {
                this._addListeners();
            }
        }
    }

    _addListeners() {
        this._worker.addEventListener('updatefound', () => {
            this._newWorker = this._worker.installing;

            this._newWorker.addEventListener('statechange', () => {
                if (this._newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.$newVersion.classList.remove('hidden');
                }
            });
        });

        let refreshing;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

    async _registerServiceWorker() {
        try {
            return await navigator.serviceWorker.register(AppUrls.worker.url, AppUrls.worker.props);
        }
        catch(e) {
            console.log('El service worker no se instaló!', e);
        }
        return null;
    }
}