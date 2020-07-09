import { StantardElement } from '../standard/standard-element.js';

export class Menu extends StantardElement {

    static get tag() {
        return 'app-menu';
    }

    static get attributes() {
        return {
            'currentMode': '_renderMode',
            'currentMenu': '_setSelectedMenu',
            'data': '_createMenu',
            'type': '_setType'
        };
    }

    static get observedAttributes() { 
        return Object.keys(Menu.attributes); 
    }

    get currentMenu() {
        return this._currentMenu;
    }

    set currentMenu(value) {
        this._currentMenu = value;
        this._setSelectedMenu();
    }

    get currentMode() {
        return this._currentMode;
    }

    set currentMode(value) {
        this._currentMode = value;
        this._renderMode();
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._createMenu();
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
        this._setType();
    }

    constructor() {
        super();
        this._defineShadow();
        this._defineVariables();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this['_'+name] = newValue;
        const fn = Menu.attributes[name];
        fn && this[fn]();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.wrapper = document.createElement('ul');

        const css = document.createElement('style');
        css.innerHTML = `
        @import "css/fa/css/all.min.css";

        li:before {
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }

        li.code:before {
            content: "\\f121";
            width: 30px;
        }

        li.icons:before {
            content: "\\f86d";
            width: 30px;
        }

        li.complete:before {
            content: "\\f022";
            width: 30px;
        }

        li.light:before {
            content: "\\f185";
            width: 30px;
        }

        li.dark:before {
            content: "\\f186";
            width: 30px;
            font-size: .9em;
        }

        li.js:before {
            font-family: 'Font Awesome 5 Brands';
            font-weight: 400;
            content: '\\f3b9';
            width: 30px;
            font-size: 1.1em;
        }

        li.drag:before {
            content: "\\f31e";
            width: 30px;
        }

        li.tour:before {
            content: "\\f4d7";
            width: 30px;
        }

        li.prog:before {
            font-family: 'Font Awesome 5 Brands';
            font-weight: 400;
            content: "\\f284";
            width: 30px;
            font-size: 1.1em;
        }

        li.switch:before {
            content: "\\f205";
            width: 30px;
        }

        li.noti:before {
            font-family: "Font Awesome 5 Free";
            font-weight: 400;
            content: "\\f27a";
            width: 30px;
        }

        li.request:before {
            content: "\\f1fa";
            width: 30px;
        }

        li.next:before {
            content: "\\f079";
            width: 30px;
        }

        li.other:before {
            content: "\\f067";
            width: 30px;
        }

        li {
            cursor: pointer;
        }
        a {
            text-decoration: none;
        }

        ul {
            list-style-type: none;
            padding: 0;
            color: #777;
        }

        .desktop {
            margin: 0;
            right: 30px;
            top: 10px;
            height: 40px;
            line-height: 40px;
        }

        .mobile,
        .mobile ul {
            margin: 0 20px;
            line-height: 30px;
        }

        .mobile i,
        .desktop i ~ span {
            display: none;
        }

        .desktop li {
            display: inline-block;
            position: relative;
            margin: 0 0.6em;
        }

        ul * {
            color: var(--menu-nav-color);
        }

        .desktop .arrow {
            display: inline-block;
            vertical-align: middle;
            margin-top: -1px;
            margin-left: 6px;
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid #4f5959;
        }

        .desktop .nav-dropdown-container .arrow {
            pointer-events: none;
        }

        .desktop .nav-dropdown {
            display: none;
            box-sizing: border-box;
            max-height: calc(100vh - 61px);
            overflow-y: auto;
            position: absolute;
            top: 100%;
            background-color: var(--menu-nav-dropdown-bgcolor);
            padding: 10px 0;
            border: 1px solid var(--menu-nav-dropdown-border-color);
            border-bottom-color: var(--menu-nav-dropdown-border-bottom-color);
            text-align: left;
            border-radius: 4px;
            white-space: nowrap;
            -webkit-box-shadow: var(--menu-nav-dropdown-boxshadow);
            box-shadow: var(--menu-nav-dropdown-boxshadow);
        }

        .desktop .nav-dropdown.right {
            right: 0;
        }

        .desktop .nav-dropdown li {
            line-height: 1.8em;
            margin: 0 15px;
            padding: 0;
            display: flex;
            align-items: center;
        }

        .desktop .nav-dropdown a {
            display: block;
            padding: 0;
            flex: 1;
        }

        .nav-link {
            white-space: nowrap;
            padding-bottom: 5px;
        }

        .current,
        .theme {
            border-bottom: 2px solid var(--menu-current) !important;
        }

        .current, 
        .current > a, 
        .current > a ~ *,
        .theme,
        .theme > a {
            color: var(--menu-current) !important;
        }

        .mobile li:not(.nav-dropdown-container) {
            height: 25px;
        }
        .mobile li {
            position: relative;
        }

        .desktop li:hover, 
        .desktop li:focus, 
        .desktop li:hover > a, 
        .desktop li:focus > a, 
        .desktop li:hover > a ~ *, 
        .desktop li:focus > a ~ *, 
        .desktop li:hover > a > *, 
        .desktop li:focus > a > *, 
        .desktop li:hover:before, 
        .desktop li:focus:before {
            color: #4283b9;
        }

        .desktop .nav-dropdown-container .arrow {
            pointer-events: none;
        }
        .desktop li:hover > span,
        .desktop li:focus > span {
            border-top: 5px solid #4283b9;
        }

        .desktop .nav-dropdown-container:hover .nav-dropdown, 
        .desktop .nav-dropdown-container:focus .nav-dropdown {
            display: block;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    _defineVariables() {
        this._type = 'desktop';
    }

    _renderMode() {
        
    }

    _setSelectedMenu() {
        s5(this.wrapper.querySelectorAll('.current')).forEach(c => c.classList.remove('current'));
        const selected = this.wrapper.querySelector(`li[href="${this._currentMenu}"]`);
        if (selected) {
            this._setSelected(selected);
        }
    }

    _createMenu() {
        this._readData(this._data, this.wrapper);
    }

    _readData(data, to) {
        const fn = to => item => this._createItem(item, to);
        data.forEach(fn(to));
    }

    _createItem(item, to) {
        const menuItem = s5('<li>', { 'is': 'app-menu-item' });
        menuItem.data = item;
        this._setEvents(menuItem, item);
        to.appendChild(menuItem);

        if (this._currentMenu === item.url) {
            this._setSelected(menuItem);
        }
    }

    _setEvents(li, { onclick: click, url }) {
        const _this = this;
        let _onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            _this._currentMenu = this.attribute('href');
            window.location.hash = _this._currentMenu;
        };
        if (click) {
            _onclick = click;
        }
        if (!url && !click) {
            _onclick = () => {};
        }

        li
            .addEvent('submenucreated', ({ ul, data }) => {
                this._readData(data, ul);
            })
            .addEvent('itemcreated', ({ li, data }) => {
                if (this._currentMenu === data.url) {
                    this._setSelected(li);
                }
            })
            .addEvent('click', _onclick);
    }

    _setSelected(li) {
        li.classList.add('current');
    }

    _setType() {
        this.wrapper.classList.add(this._type);
    }

    addMenu(data) {
        this._createItem(data, this.wrapper);
    }
}