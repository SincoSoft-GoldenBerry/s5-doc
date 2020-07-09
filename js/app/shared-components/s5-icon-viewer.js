import { StantardElement } from '../views/standard/standard-element.js';

export class IconsViewer extends HTMLElement {
    static get tag() {
        return 's5-icon-viewer';
    }

    static get observedAttributes() { return ['hover']; }

    set hover(value) {
        this._hover = value;
        this._renderHover();
    }

    get hover() {
        return this._hover;
    }

    constructor() {
        super();
        this._defineShadow();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._hover = newValue === 'true';
        this._renderHover();
    }

    _renderHover() {
        if (this._hover) {
            this.wrapper.classList.add('hover');
        }
        else {
            this.wrapper.classList.remove('hover');
        }
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('icon');
        this.wrapper.innerHTML = '<slot></slot>';

        const css = document.createElement('style');
        css.innerHTML = `
        ${StantardElement.standardCss}
        div.icon {
            background-color: var(--icon-bgcolor);
            border: 2px solid transparent;
            border-radius: 10px;
            cursor: pointer;
            width: 80px;
            max-width: 80px;
            height: 80px;
            max-height: 80px;
            margin: 10px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            transition: box-shadow .2s, border-color .2s;
            flex-grow: 1;
        }

        div.icon:hover, div.icon:focus, div.icon.hover {
            border-color: var(--icon-border-color);
            -webkit-box-shadow: var(--icon-boxshadow);
            box-shadow: var(--icon-boxshadow);
            width: 84px;
            max-width: 84px;
            height: 84px;
            max-height: 84px;
            margin: 8px;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }
}