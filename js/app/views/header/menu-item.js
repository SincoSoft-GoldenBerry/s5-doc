export class MenuItem extends HTMLLIElement {
    static get tag() {
        return 'app-menu-item';
    }

    static get extended() {
        return { extends: "li" };
    }

    connectedCallback() {
        this._render();
    }

    async _render() {
        if (this.data) {
            const { name, url, version, sub, _class, mode } = this.data;
            const text = s5('<a>').insertTo(this);
            text.innerHTML = name;

            if (_class) {
                this.className = _class;
            }

            if (url) {
                this.setAttribute('href', url);
                text.classList.add('nav-link');
            }

            if (mode) {
                this.setAttribute('mode', mode);
            }

            if (version !== null && version !== undefined) {
                s5('<aside>', { 'class': `v${version}` }).insertTo(this);
            }

            if (sub && sub.length > 0) {
                this.classList.add('nav-dropdown-container');
                s5('<span>', { 'class': 'arrow' }).insertTo(this);
                const subUl = s5('<ul>', { 'class': 'nav-dropdown right' }).insertTo(this);
                this._dispatchEvent(subUl, sub);
            }

            const event = new Event('itemcreated', { bubbles: false });
            event.li = this;
            event.data = this.data;
            this.dispatchEvent(event);
        }
    }

    _dispatchEvent(ul, data) {
        const event = new Event('submenucreated', { bubbles: false });
        event.ul = ul;
        event.data = data;
        this.dispatchEvent(event);
    }

    /*
    
    <li class="current" href="#index">
                    <a class="nav-link">Inicio</a>
                </li>
                <li class="nav-dropdown-container">
                    <a class="">Componentes</a>
                    <span class="arrow"></span>
                    <ul class="nav-dropdown right">
                        <li class="js" href="#components-prototypes"><a class="nav-link">Object, String, Array & JSON Prototypes</a></li>
                        <li class="icons" href="#components-s5.icons"><a class="nav-link">Íconos SVG</a></li>
                        <li class="complete" href="#components-s5.autocomplete"><a class="nav-link">Autocomplete</a></li>
                        <li class="other" href="#components-otros"><a class="nav-link">Otros</a></li>
                    </ul>
                </li>
                <li class="nav-dropdown-container">
                    <a class="">¡El código!</a>
                    <span class="arrow"></span>
                    <ul class="nav-dropdown right codigo">
                        <li class="code" href="#code-s5.js"><a class="nav-link">s5.js (v1)</a><aside class="v1"></aside></li>
                        <li class="code" href="#code-v2/s5.js"><a class="nav-link">s5.js (v2)</a><aside class="v2"></aside></li>
                        <li class="request" href="#code-v2/s5.request.js"><a class="nav-link">s5.request.js</a><aside class="v2"></aside></li>
                        <li class="icons" href="#code-s5.icons.js"><a class="nav-link">s5.icons.js</a><aside class="v1"></aside></li>
                        <li class="drag" href="#code-s5.dragdrop.js"><a class="nav-link">s5.dragdrop.js</a><aside class="v1"></aside></li>
                        <li class="complete" href="#code-s5.autocomplete.js"><a class="nav-link">s5.autocomplete.js</a><aside class="v1"></aside></li>
                        <li class="tour" href="#code-s5.tour.js"><a class="nav-link">s5.tour.js</a><aside class="v1"></aside></li>
                        <li class="prog" href="#code-s5.progress.circular.js"><a class="nav-link">s5.progress.circular.js</a><aside class="v1"></aside></li>
                        <li class="switch" href="#code-s5.switch.js"><a class="nav-link">s5.switch.js</a><aside class="v1"></aside></li>
                        <li class="noti" href="#code-s5.notifications.js"><a class="nav-link">s5.notifications.js</a><aside class="v1"></aside></li>
                        <li class="next" href="#code-s5.carousel.js"><a class="nav-link">s5.carousel.js</a><aside class="v1"></aside></li>
                    </ul>
                </li>
                <li href="#who">
                    <a class="nav-link">¿Quiénes somos?</a>
                </li>
                <li class="nav-dropdown-container">
                    <a class=""><i class="fa fa-sun current-theme"></i><span>Tema</span></a>
                    <span class="arrow"></span>
                    <ul class="nav-dropdown right">
                        <li class="light"><a class="nav-link" mode="light">Light</a></li>
                        <li class="dark"><a class="nav-link" mode="dark">Dark</a></li>
                    </ul>
                </li>
    */
}