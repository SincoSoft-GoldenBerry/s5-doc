import { StantardElement } from './standard/standard-element.js';
import { Cookies } from '../../helpers/cookies.js';

export class Header extends StantardElement {

    static get tag() {
        return 'app-header';
    }

    static get attributes() {
        return {
            'currentMode': '_renderMode'
        };
    }

    static get observedAttributes() { 
        return Object.keys(Header.attributes); 
    }

    get currentMode() {
        return this._currentMode;
    }

    set currentMode(value) {
        this._currentMode = value;
        this._renderMode();
    }

    get currentMenu() {
        return this.$menus[0].currentMenu;
    }

    set currentMenu(value) {
        this.$menus.forEach(m => m.currentMenu = value);
    }

    get menuTitle() {
        return this._menuTitle;
    }

    constructor() {
        super();
        this._defineShadow();
        this._defineVariables();
        this._appendEvents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this['_'+name] = newValue;
        const fn = Header.attributes[name];
        fn && this[fn]();
    }

    _defineShadow() {
        this.wrapper = this.attachShadow({ mode: 'open' });
        
        this.wrapper.innerHTML = `
        <style>
        @import "css/fa/css/all.min.css";
        ${StantardElement.standardCss}
        ${StantardElement.standardCssBtn}

        header {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            height: var(--header-height);
            background-color: var(--header-bgcolor);
            -webkit-box-shadow: var(--header-boxshadow);
            box-shadow: var(--header-boxshadow);
        }

        .img-logo {
            padding: 10px 30px;
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: center;
        }

        .sidebar-menu-bg {
            position: fixed;
            top: 49px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10;
            display: none;
        }
        
        .sidebar-menu {
            position: fixed;
            top: 49px;
            left: -500px;
            bottom: 0;
            background-color: var(--menu-sidebar-menu-bgcolor);
            overflow-x: hidden;
            overflow-y: auto;
            z-index: 11;
            font-size: .8em;
            box-shadow: var(--menu-sidebar-menu-boxshadow);
            padding-bottom: 10px;
        }

        .navbar-button {
            position: relative;
            float: right;
            padding: 4px 5px;
            margin-top: 8px;
            margin-left: 15px;
            margin-bottom: 8px;
            background-color: transparent;
            background-image: none;
            border: 1px solid transparent;
            border-radius: 4px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
            font-size: 12px;
            color: #767676;
            cursor: pointer;
            -webkit-appearance: button;
            line-height: inherit;
        }

        .navbar-button .icon-bar {
            display: block;
            width: 22px;
            height: 2px;
            border-radius: 1px;
            background-color: #888;
        }

        .navbar-button .icon-bar:nth-of-type(3) {
            margin: 4px 0;
        }

        .btn-menu-container {
            display: none;
        }

        button:hover, button:focus {
            background-color: #563d7c;
            border-color: #563d7c;
            color: #333;
            text-decoration: none;
            background-position: 0 -15px;
        }

        button:active {
            background-image: none;
        }

        button:hover, .navbar-button:focus {
            background-color: var(--menu-navbar-button-hover-bgcolor);
            border-color: var(--menu-navbar-button-hover-border-color);
        }

        @media (max-width: 700px) {
            header {
                left: 0;
                right: 0;
                justify-content: center;
                padding: 10px;
            }
            .btn-menu-container {
                display: flex;
                flex-flow: row;
                justify-content: center;
                align-items: center;
                align-content: center;
                position: absolute;
                left: 10px;
                bottom: 0;
                top: 0;
            }
            .navbar-button {
                margin: 0 !important;
            }
            .sidebar-menu.visible {
                left: 0;
            }
            .sidebar-menu-bg.visible {
                display: inherit;
            }
            .img-logo {
                padding: 0 20px;
            }
            .desktop-menu {
                display: none;
            }
        }

        </style>
        <header>
            <section class="btn-menu-container">
                <button type="button" class="navbar-button">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </section>
            <section class="img-logo">
                <img src="images/light-Logo_S5.png" alt="S5" height="30" />
            </section>
            <app-menu class="desktop-menu" type="desktop"></app-menu>
        </header>
        <aside class="sidebar-menu-bg"></aside>
        <section class="sidebar-menu">
            <app-menu class="main-menu" type="mobile"></app-menu>
        </section>
        `;
    }

    _defineVariables() {
        this.$logos = this.wrapper.querySelectorAll('.img-logo > img');
        this.$menus = this.wrapper.querySelectorAll('app-menu');
        this.$btnMenu = this.wrapper.querySelector('.navbar-button');
        this.$sideBar = this.wrapper.querySelector('.sidebar-menu');
        this.$sideBarBg = this.wrapper.querySelector('.sidebar-menu-bg');

        this._currentMode = '';
        this._menuTitle = '';

        this._cookie = new Cookies();
    }

    _appendEvents() {
        const fn = () => this._toggleNavBar();
        this.$btnMenu.addEventListener('click', fn);
        this.$sideBarBg.addEventListener('click', fn);
    }

    _renderMode() {
        this._setLogo();
        this._setToMenu();
    }

    _writeCookie(value) {
        this._cookie.write('view', value);
    }

    _onClickTheme(e) {
        const mode = e.currentTarget.getAttribute('mode');
        this._writeCookie(mode);
        window.location.reload();
    }

    _loadThemeSelector() {
        const data = {
            name: `<i class="fa fa-${this._currentMode === 'dark' ? 'moon' : 'sun'}"></i><span>Tema</span>`,
            sub: [
                {
                    name: 'Light',
                    _class: 'light ' + (this._currentMode === 'dark' ? '' : 'theme'),
                    mode: 'light',
                    onclick: e => this._onClickTheme(e)
                },
                {
                    name: 'Dark',
                    _class: 'dark ' + (this._currentMode === 'dark' ? 'theme' : ''),
                    mode: 'dark',
                    onclick: e => this._onClickTheme(e)
                }
            ]
        };
        this.$menus.forEach(menu => menu.addMenu(data));
    }

    async _toggleNavBar() {
        this.$sideBar.classList.toggle('visible');
        this.$sideBarBg.classList.toggle('visible');
    }

    async hideMenu() {
        this.$sideBar.classList.remove('visible');
        this.$sideBarBg.classList.remove('visible');
    }

    async _setLogo() {
        this.$logos.forEach(img => img.setAttribute('src', `images/${this._currentMode}-Logo_S5.png`));
    }

    async _setToMenu() {
        this.$menus.forEach(menu => menu.currentMode = this._currentMode);
    }

    async loadMenu(data) {
        this.$menus.forEach(menu => menu.data = data);
        this._loadThemeSelector();
    }
}