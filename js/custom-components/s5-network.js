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
        @import "css/fa/css/all.min.css";
        
        @keyframes blinkingcolor{
            0%{		opacity: 1;	    }
            25%{    opacity: .75;   }
            50%{    opacity: .5;   }
            75%{    opacity: .75;   }
            100%{	opacity: 1;	}
        }
        
        aside {
            font-size: .8em;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
        }
        
        aside:not(.offline):not(.online) { animation: blinkingcolor .8s infinite; }
        
        aside > .fa-slash {
            position: absolute;
            transition: all ease 1s;
        }
        
        aside:not(.offline) > .fa-slash { opacity: 0; }
        
        aside.offline > .fa-slash { opacity: 1; }
        
        aside *, aside.offline * { color: #777777; }
        
        aside.online * { color: #4caf50; }
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

        const _offline = () => {
            this.wrapper.classList.add('offline');
            this._online = false;
        };

        if (navigator.onLine) {

            await window.waitForGlobal('s5.hr');

            try {
                await s5.hr.get('ping.json');
                this.wrapper.classList.add('online');
                this._online = true;
            }
            catch (e) {
                _offline();
            }
            finally {
                return;
            }
        }
        _offline();
    }

    _agregarEventos() {
        const comprobarConexion = () => this._comprobarConexion();
        window.addEventListener('online', comprobarConexion);
        window.addEventListener('offline', comprobarConexion);
    }
}

customElements.define('s5-network', Network);