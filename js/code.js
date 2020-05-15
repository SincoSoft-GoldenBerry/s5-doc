window['app'].define('code', [], () => {
    const { v1, v2 } = window['app-version'];
    const urlBase = 'https://cdn.jsdelivr.net/npm/s5-js';

    const getUrl = url => (v = null) => {
        const ret = {
            url: '',
            show: 'v1'
        };
        if (/v2/i.test(url)){
            ret.url = `${urlBase}@${v || v2}/${url.split('v2/').join('')}`;
            ret.show = 'v2';
        }
        else {
            ret.url = `${urlBase}@${v || v1}/${url}`;
        }
        return ret;
    };

    const crearDiseno = _url => {
        const fnUrl = getUrl(_url);
        const { url, show } = fnUrl();

        const { textContent: menu } = s5('.current > a').shift();
        document.title = `¡El código! - ${menu} - By: GoldenBerry`;

        const btnDescarga = s5('<button>', { 'type': 'button', 'class': 'descarga success', 'disabled': 'disabled', 'title': `Descargar ${menu}` })
                                .insert(s5('<i>', { 'class': 'fas fa-download' }))
                                .addEvent('click', () => {
                                    const { selected } = versiones;
                                    const { url: urlDownload } = fnUrl(selected);
                                    window.open(urlDownload, '_blank');
                                });

        const versiones = s5('<s5-version>', { 'title': 'Versión para descargar', 'current-v1': v1, 'current-v2': v2, 'show': show, 'mode': document.body.className });

        const codeContainer = s5('<div>', { 'id': 'code-container' }).addEvent('versionslist', () => btnDescarga.removeAttribute('disabled'));

        s5('<section>', { 'id': 'code-title' }).insert([
            s5('<h2>').insert(document.createTextNode(`¡El código! - ${menu}`)),
            s5('<div>', { 'class': 'div-descarga' }).insert([
                versiones,
                btnDescarga
            ])
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