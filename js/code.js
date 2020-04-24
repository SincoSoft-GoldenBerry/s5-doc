window['app'].define('code', [], () => {
    const urlBase = 'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/';

    const crearDiseno = url => {
        const menu = document.querySelector('.current > a');
        document.title = `¡El código! - ${menu.textContent} - By: GoldenBerry`;

        const btnDescarga = s5.createElem('button', { 'type': 'button', 'class': 'descarga success', 'title': `Descargar ${menu.textContent}` })
                                .insert(s5.createElem('i', { 'class': 'fas fa-download' }));

        btnDescarga.addEvent('click', () => window.open(url, '_blank'));

        const titulo = s5.createElem('section', { 'id': 'code-title' }).insert([
            s5.createElem('h2').insert(document.createTextNode(`¡El código! - ${menu.textContent}`)),
            btnDescarga
        ]);

        const codigo = s5.createElem('s5-code');

        codigo.addEvent('codeshow', window['onLoadEnd']);

        s5.hr.get(url, { contentType: 'text' })
            .then(({ status, data }) => {
                if (status === 200) {
                    codigo.loadCode(data);
                }
            })
            .catch(e => 
                codigo.loadCode(`// No se puede cargar el recurso: ${url}\n// verifique los mensajes en consola\n// ${JSON.stringify(e)}`)
            );

        const codeContainer = s5.createElem('div', { 'id': 'code-container' }).insert([
            titulo,
            codigo
        ]);

        return codeContainer;
    };

    return {
        init: scriptUrl => crearDiseno(urlBase + scriptUrl)
    };
});