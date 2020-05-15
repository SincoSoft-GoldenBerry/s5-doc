class Version extends HTMLElement {

    get selected() {
        return this.wrapper.value;
    }

    constructor() {
        super();

        this._defineShadow();
    }

    static get observedAttributes() { return ['current-v1', 'current-v2', 'show', 'mode']; }

    attributeChangedCallback(attr, oldValue, newValue) {
        this[attr] = newValue;
        if (attr === 'mode')
            this.wrapper.classList.add(newValue);
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
            const { status, data } = await s5.hr.get('https://data.jsdelivr.com/v1/package/npm/s5-js', { contentType: 'text' });
            if (status === 200) {
                let { versions } = JSON.parse(data);
                versions = versions.reduce((ac, v) => {
                    if (v.startsWith('1')){
                        ac['v1'].push(v);
                    }
                    else {
                        ac['v2'].push(v);
                    }
                    return ac;
                }, { 'v1': [], 'v2': [] });
                this._showResults(versions[this.show]);
            }
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