class Modal extends HTMLElement {
    get content() {
        return this._content;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
        this._render();
    }

    get minWidth(){
        return this['_min-width'] || 40;
    }

    set minWidth(value) {
        this['_min-width'] = value;
        this._render();
    }

    constructor() {
        super();

        this._title = null;
        this['_min-width'] = null;

        this._defineShadow();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('aside');

        const css = document.createElement('style');
        css.innerHTML = `
        aside, aside *{ transition: none !important; }

        aside {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(167, 166, 166, 0.82);
            display: none;
            justify-content: center;
            align-items: center;
            align-content: center;
            z-index: 2;
        }

        aside.show { display: flex; }

        aside > div {
            border: 1px solid var(--modal-border-color);
            color: var(--modal-color);
            border-radius: 10px;
            padding: 5px;
            max-width: 95%;
            background-color: var(--modal-bgcolor);
            font-size: 1.2em;
            -webkit-box-shadow: var(--modal-boxshadow);
            box-shadow:         var(--modal-boxshadow);
        }

        .modal-title {
            border-radius: 5px;
            background-color: var(--modal-title-bgcolor);
            padding: 8px 10px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title button {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            padding: 5px 10px !important;
            cursor: pointer;
            border-radius: 2px;
            outline: none;
            border: none;
            background-color: #00796b;
            color: #FFFFFF;
            transition: all .2s !important;
        }

            .modal-title button:hover,
            .modal-title button:focus {
                background-color: #009688;
                -webkit-box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14), 0 1px 7px 0 rgba(0,0,0,0.12), 0 3px 1px -1px rgba(0,0,0,0.2);
                box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14), 0 1px 7px 0 rgba(0,0,0,0.12), 0 3px 1px -1px rgba(0,0,0,0.2);
            }

        .modal-body {
            padding: 10px;
            font-size: 0.8em;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    static get observedAttributes() { return ['title', 'min-width']; }

    attributeChangedCallback(name, oldValue, newValue) {
        this[`_${name}`] = newValue;
        this._render();
    }

    connectedCallback() {
        this._render();
    }

    show() {
        this.wrapper.classList.add('show');
    }

    close() {
        this.wrapper.classList.remove('show');
        this.wrapper.innerHTML = '';
    }

    async _render() {
        this.wrapper.innerHTML = `
            <div style="min-width: ${this.minWidth}%; position: absolute;" class="modal">
                <div class="modal-title">
                    ${this.title}
                    <button type="button" class="btn success" title="Cerrar modal (Esc)">x</button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
            </div>
        `;

        this._appendEvents();
        await window.waitForGlobal('s5.utilities.dragDrop')
        this._dragdrop();
    }

    _appendEvents(){
        const close = () => this.close();

        this.wrapper.addEventListener('click', close);
        this.wrapper.querySelector('button').addEventListener('click', close);

        this.wrapper.querySelectorAll('div, *:not(.btn)').forEach(element => 
            element.addEventListener('click', e => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, false)
        );

        window.addEventListener('keyup', e => {
            if (e.keyCode === 27) {//Esc
                this.close();
            } 
        });
    }

    _dragdrop() {
        new s5.utilities.dragDrop(this.wrapper.querySelector('.modal'), this.wrapper, this.wrapper.querySelector('.modal-title'));
    }
}

customElements.define('s5-modal', Modal);