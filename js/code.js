window['app'].define('code', [], () => {
    const { v1, v2 } = window['app-version'];
    const urlBase = 'https://cdn.jsdelivr.net/npm/s5-js';

    const crearDiseno = url => {
        if (/v2/i.test(url)){
            url = `${urlBase}@${v2}/${url.split('v2/').join('')}`;
        }
        else {
            url = `${urlBase}@${v1}/${url}`;
        }

        const { textContent: menu } = s5('.current > a').shift();
        document.title = `¡El código! - ${menu} - By: GoldenBerry`;

        const btnDescarga = s5('<button>', { 'type': 'button', 'class': 'descarga success', 'title': `Descargar ${menu}` })
                                .insert(s5('<i>', { 'class': 'fas fa-download' }))
                                .addEvent('click', () => window.open(url, '_blank'));

        const codeContainer = s5('<div>', { 'id': 'code-container' });

        s5('<section>', { 'id': 'code-title' }).insert([
            s5('<h2>').insert(document.createTextNode(`¡El código! - ${menu}`)),
            btnDescarga
        ]).insertTo(codeContainer);
        
        const codigo = s5('<s5-code>').addEvent('codeshow', window['onLoadEnd']).insertTo(codeContainer);

        s5.hr.get(url, { contentType: 'text' })
            .then(({ status, data }) => {
                if (status === 200) {
                    codigo.loadCode(data);
                }
            })
            .catch(e => 
                codigo.loadCode(`// No se puede cargar el recurso: ${url}\n// verifique los mensajes en consola\n// ${JSON.stringify(e)}`)
            );

        return codeContainer;
    };

    return {
        init: crearDiseno
    };
});