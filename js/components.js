window['app'].define('components', [], () => {
    const urlBase = 'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/';

    const crearDiseno = componente => {
        var menu = s5.get('.current > a').shift();
        document.title = `Componentes - ${menu.textContent} - By: GoldenBerry`;

        const btnDescarga = s5.createElem('button', { 'type': 'button', 'class': 'descarga success', 'title': `Descargar ${componente}`})
                            .insert(s5.createElem('i', { 'class': 'fas fa-download' }));

        btnDescarga.addEvent('click', () => window.open(`${urlBase + componente}.js`, '_blank'));

        const titulo = s5.createElem('section', { 'id': 'component-title' }).insert([
            s5.createElem('h2').insert(document.createTextNode(`Componente: ${menu.textContent}`)),
            btnDescarga
        ]);

        const contenido = s5.createElem('section', { 'id': 'demo-container' });

        window['app'].require([`components/${componente}`], ({ get, onInserted }) => {
            contenido.insert(get());
            if (onInserted)
                onInserted();
            window['onLoadEnd']();
        });

        return s5.createElem('div', { 'id': 'component-container' }).insert([
            titulo,
            contenido
        ]);
    };

    return {
        init: crearDiseno
    };
});