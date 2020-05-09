window['app'].define('components', [], () => {
    const { v1, v2 } = window['app-version'];
    const urlBase = 'https://cdn.jsdelivr.net/npm/s5-js';

    const crearDiseno = componente => {
        let url;
        if (/v2/i.test(componente)){
            url = `${urlBase}@${v2}/${componente}.js`;
        }
        else {
            url = `${urlBase}@${v1}/${componente}.js`;
        }

        const { textContent: menu } = s5('.current > a').shift();
        document.title = `Componentes - ${menu} - By: GoldenBerry`;

        const btnDescarga = s5('<button>', { 'type': 'button', 'class': 'descarga success', 'title': `Descargar ${componente}`})
                            .insert(s5('<i>', { 'class': 'fas fa-download' }))
                            .addEvent('click', () => window.open(url, '_blank'));

        const titulo = s5('<section>', { 'id': 'component-title' }).insert([
            s5('<h2>').insert(document.createTextNode(`Componente: ${menu}`)),
            btnDescarga
        ]);

        const contenido = s5('<section>', { 'id': 'demo-container' });

        window['app'].require([`components/${componente}`], ({ get, onInserted }) => {
            contenido.insert(get());
            if (onInserted)
                onInserted();
            window['onLoadEnd']();
        });

        return s5('<div>', { 'id': 'component-container' }).insert([
            titulo,
            contenido
        ]);
    };

    return {
        init: crearDiseno
    };
});