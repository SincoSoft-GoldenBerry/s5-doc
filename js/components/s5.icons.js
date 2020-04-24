window['app'].define('components/s5.icons', [], () => {
    const color = document.body.classList.contains('dark') ? '#C7C7C7' : '#6D6D6D';
    const modal = s5.get('modal');
    const dim = 40;

    const iconosEspeciales = {
        BaseDatos: () => s5.iconos.BaseDatos(dim, true, color),
        Calendario: () => s5.iconos.Calendario(dim),
        Clip: () => s5.iconos.Clip((dim*dim)/112.8, color),
        Laptop: () => s5.iconos.Laptop(dim),
        LogoSinco: () => s5.iconos.LogoSinco((dim*97)/155),
        ConfigApp: () => s5.iconos.ConfigApp((dim*dim)/68.25, color),
        IT: () => s5.iconos.IT(dim),
        Modulo: () => s5.iconos.Modulo(dim, 'GB', { top: '#eb6e00', bottom: '#fb9500' }),
        NetWork: () => s5.iconos.NetWork(dim, { circle: '#00a1f1', bar: color }),
        SQLServer: () => s5.iconos.SQLServer(dim),
        Security: () => s5.iconos.Security(dim),
        Servidor: () => s5.iconos.Servidor(dim, true, color),
        Shuffle: () => s5.iconos.Shuffle(dim, color, '#F90'),
        SincoPlus: () => s5.iconos.SincoPlus(dim),
        Windows: () => s5.iconos.Windows(dim),
        YouTube: () => s5.iconos.YouTube(dim, '#ff0000')
    };

    const iconos = Object.keys(s5.iconos).sort().map(icono => {
        const contenedorIcono = s5.createElem('div', { 'class': 'icono' });
        let iconoSinco;
        
        if (!iconosEspeciales[icono])
            iconoSinco = s5.iconos[icono](dim, color);
        else 
            iconoSinco = iconosEspeciales[icono]();

        contenedorIcono.insert(iconoSinco);
        contenedorIcono.icono = icono;

        const clickIcono = iconoClick => () => {
            const contenidoModal = s5.createElem('div', { 'class': 'contenido-modal-icono' });
            const reg = new RegExp('\\(([^\\(\\)]*)\\)', 'i');

            let definicion = s5.iconos[iconoClick].toString();

            const htmlDefinicion = reg.exec(definicion).shift()
                                        .replace(/\(|\)/g, '')
                                        .replace(/\,/g, '<span class="character">,</span>');
            
            definicion = s5.createElem('span', { 'class': 'normal' });
            definicion.innerHTML = htmlDefinicion;

            const codigo = s5.createElem('s5-code');

            codigo.loadCode(`/*Uso con s5.js v1 y v2*/\nSinco.iconos.BoxPacking(dim, bgColor);\n\n/*Uso con s5.js v2*/\ns5.iconos.BoxPacking(dim, bgColor);`);

            contenidoModal.insert([
                s5.createElem('div').insert(
                    s5.createElem('div', { 'class': 'icono hover' }).insert(iconoSinco.cloneNode(true))
                ),
                s5.createElem('span').insert(document.createTextNode('Código JS para su uso:')),
                codigo
            ]);

            modal.innerHTML = '';
            modal.title = `Ícono: ${iconoClick}`;
            modal.appendChild(contenidoModal);

            modal.show();
        };

        contenedorIcono.addEvent('click', clickIcono(icono));

        return contenedorIcono;
    });

    return {
        get: () => s5.createElem('div', { 'class': 'icons-container' }).insert(iconos)
    };
});