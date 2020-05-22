class Version extends HTMLElement {

    get selected() {
        return this.wrapper.value;
    }

    constructor() {
        super();

        this._defineShadow();
    }

    static get observedAttributes() { return ['show', 'mode', 'file']; }

    attributeChangedCallback(attr, oldValue, newValue) {
        this[attr] = newValue;
        if (attr === 'mode')
            this.wrapper.classList.add(newValue);
        if (attr === 'file')
            this[attr] = newValue.split(' ').shift();
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

    _render() {
        this.wrapper.innerHTML = '';

        this._listVersions();
    }

    async _listVersions() {
        try {
            const db = await new s5Database().open();

            const versions = await db.getAll('s5-versions');
            
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
            console.log('Error al consultar las versiones:', e);
            s5('<option>', { 'value': '-1' }).insert(document.createTextNode('--')).insertTo(this.wrapper);
        }
    }

    _showResults(versions) {
        versions.forEach(v => s5('<option>', { 'value': v }).insert(document.createTextNode(v)).insertTo(this.wrapper));

        const event = new Event('versionslist', { bubbles: true });
        this.dispatchEvent(event);
    }
}

customElements.define('s5-version', Version);