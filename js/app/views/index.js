import { StantardElement } from './standard/standard-element.js';

export class Index extends StantardElement {
    static get tag() {
        return 'app-index';
    }

    constructor() {
        super();
        this._defineShadow();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('section');
        this.wrapper.classList.add('index-container');
        this.wrapper.innerHTML = `
        <section class="index-logo-container"></section>
        <section class="index-nb-container">
            <section class="index-name-container">
                <span>El Framework JavaScript</span>
                <span>de todo SincoSoft</span>
            </section>
            <section class="index-buttons-container"></section>
        </section>
        `;

        const css = document.createElement('style');
        css.innerHTML = `
        ${StantardElement.standardCss}
        .index-container {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            color: #466986;
        }

        .index-container section {
            padding: 20px;
        }

        .index-logo-container {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            align-content: center;
        }

        .index-nb-container {
            display: flex;
            flex-flow: column;
            justify-content: center;
        }

        .index-name-container {
            display: flex;
            flex-flow: column;
            justify-content: flex-end;
            font-size: 2.2em;
        }

        .index-name-container>span:first-of-type {
            margin-bottom: 5px;
        }

        .index-name-container>span:last-of-type {
            margin-top: 5px;
        }

        .index-buttons-container {
            display: flex;
            flex-flow: row;
            justify-content: flex-start;
            align-items: flex-start;
            align-content: flex-start;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        this.dispatchCustomEvent(this.wrapper);
    }
}