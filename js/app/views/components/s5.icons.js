import { StantardElement } from '../standard/standard-element.js';

export class IconsComponent extends StantardElement {
    static get tag() {
        return 'app-icons';
    }

    static specials(dim, color) {
        return {
            BaseDatos:  () => s5.iconos.BaseDatos(dim, true, color),
            Calendario: () => s5.iconos.Calendario(dim),
            Clip:       () => s5.iconos.Clip((dim*dim)/112.8, color),
            Laptop:     () => s5.iconos.Laptop(dim),
            LogoSinco:  () => s5.iconos.LogoSinco((dim*97)/155),
            ConfigApp:  () => s5.iconos.ConfigApp((dim*dim)/68.25, color),
            IT:         () => s5.iconos.IT(dim),
            Modulo:     () => s5.iconos.Modulo(dim, 'GB', { top: '#eb6e00', bottom: '#fb9500' }),
            NetWork:    () => s5.iconos.NetWork(dim, { circle: '#00a1f1', bar: color }),
            SQLServer:  () => s5.iconos.SQLServer(dim),
            Security:   () => s5.iconos.Security(dim),
            Servidor:   () => s5.iconos.Servidor(dim, true, color),
            Shuffle:    () => s5.iconos.Shuffle(dim, color, '#F90'),
            SincoPlus:  () => s5.iconos.SincoPlus(dim),
            Windows:    () => s5.iconos.Windows(dim),
            YouTube:    () => s5.iconos.YouTube(dim, '#ff0000')
        };
    }

    constructor() {
        super();
        this._defineShadow();
        this._initVariables();
    }

    connectedCallback() {
        this._render();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('icons-container');

        const css = document.createElement('style');
        css.innerHTML = `
        .icons-container {
            display: flex;
            flex-flow: row wrap;
            align-content: center;
            align-items: center;
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    _initVariables() {
        this._color = document.body.classList.contains('dark') ? '#C7C7C7' : '#6D6D6D';
        this.$modal = s5('modal');
        this._definitionRegex = new RegExp('\\(([^\\(\\)]*)\\)', 'i');
    }

    async _render() {
        const fn = dim => icon => this._renderIcon(icon, dim);

        Object.keys(s5.iconos).sort().forEach(fn(40));

        this.dispatchCustomEvent();
    }

    _extractHtmlDefinition(definicion) {
        return this._definitionRegex.exec(definicion).shift().replace(/\(|\)/g, '');
    }

    _showModal(iconoClick, content) {
        this.$modal.innerHTML = '';
        this.$modal.title = `Ícono: ${iconoClick}`;
        this.$modal.appendChild(content);
        this.$modal.show();
    }

    _clickIcon(viewer, iconoClick) {
        const clonedViewer = viewer.cloneNode(true);
        clonedViewer.hover = true;

        const contenidoModal = s5('<div>', { 'class': 'contenido-modal-icono' });
        const codigo = s5('<s5-code>');

        const definicion = s5.iconos[iconoClick].toString();
        const htmlDefinicion = this._extractHtmlDefinition(definicion);

        codigo.loadCode(`/*Uso con s5.js v1 y v2*/\nSinco.iconos.${iconoClick}(${htmlDefinicion});\n\n/*Uso con s5.js v2*/\ns5.iconos.${iconoClick}(${htmlDefinicion});`);

        contenidoModal.insert([
            s5('<div>', { 'style': 'display: flex; justify-content: center;' }).insert(clonedViewer),
            s5('<span>').insert(document.createTextNode('Código JS para su uso:')),
            codigo
        ]);

        this._showModal(iconoClick, contenidoModal);
    }

    _renderIcon(icono, dim) {
        const click = (viewer, iconName) => () => this._clickIcon(viewer, iconName);
        const special = IconsComponent.specials(dim, this._color);

        let iconoSinco;

        if (!special[icono])
            iconoSinco = s5.iconos[icono](dim, this._color);
        else 
            iconoSinco = special[icono](dim);

        const viewer = s5('<s5-icon-viewer>');

        viewer
            .addEvent('click', click(viewer, icono))
            .insert(iconoSinco)
            .insertTo(this.wrapper);
    }
}