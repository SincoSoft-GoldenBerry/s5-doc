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
            @import "css/fa/css/all.css";
            @import "css/default.css";
            @import "css/custom-components/s5-modal.css";
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

    _render() {
        this.wrapper.innerHTML = `
            <div style="min-width: ${this.minWidth}%; position: absolute;" class="modal">
                <div class="modal-title">
                    ${this.title}
                    <button type="button" class="btn success"><i class="fa fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
            </div>
        `;

        this._appendEvents();
        this._dragdrop();
    }

    _appendEvents(){
        const close = () => this.close();

        this.wrapper.addEventListener('click', close);
        this.wrapper.querySelector('button').addEventListener('click', close);

        this.wrapper.querySelectorAll('div, *:not(.btn):not(.fa)').forEach(element => 
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