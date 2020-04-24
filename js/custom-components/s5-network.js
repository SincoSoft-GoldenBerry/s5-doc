class Network extends HTMLElement {

    get isonline() {
        return this._online;
    }

    constructor() {
        super();

        this._online = null;

        this._defineShadow();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('aside');

        const css = document.createElement('style');
        css.innerHTML = `
            @import "css/fa/css/all.css";
            @import "css/custom-components/s5-network.css";
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        this.wrapper.innerHTML = `
            <i class="fas fa-slash"></i>
            <i class="fas fa-wifi"></i>
        `;

        this._comprobarConexion();
        this._agregarEventos();
    }

    async _comprobarConexion() {
        this.wrapper.classList.remove.apply(this.wrapper.classList, ['offline', 'online']);
        if (navigator.onLine) {
            try {
                await s5.hr.get('ping.json');
                this.wrapper.classList.add('online');
                this._online = true;
                return;
            }
            catch (e) {
            }
        }
        this.wrapper.classList.add('offline');
        this._online = false;
    }

    _agregarEventos() {
        const comprobarConexion = () => this._comprobarConexion();
        window.addEventListener('online', comprobarConexion);
        window.addEventListener('offline', comprobarConexion);
    }
}

customElements.define('s5-network', Network);