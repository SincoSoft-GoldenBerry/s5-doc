window['app'].define('code', [], () => {
    const urlBase = 'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/';

    const fnWordRegex = (s, a) => `${s !== '' ? s + '|' : s}[^.]\\b(${a})\\b`;

    const replaceAll = (_this, rThis, rWith) => _this.replace(new RegExp(rThis, 'g'), rWith);

    const types = [
        {
            'regex': '([^a-zA-Z])("([^"]*)"|\'([^\']*)\'|`([^`]*)`)',
            'fn': matches => `${matches[1]}<span class="string">${matches[2]}</span>`
        },
        {
            'regex': 'delete|const|let|function|async|var|new|null|typeof|instanceof|void|in|with|throw|true|false|this|arguments'.split('|').reduce(fnWordRegex, ''),
            'fn': ([match]) => `<span class="reserved_a">${match}</span>`
        },
        {
            'regex': 'await|return|if|else|switch|case|break|continue|for|while|do|catch|finally'.split('|').reduce(fnWordRegex, ''),
            'fn': ([match]) => `<span class="reserved_b">${match}</span>`
        },
        {
            'regex': 'Object|Array|String|TypeError|JSON|Error|HTMLElement|RegExp|Math|Number|SVGElement|Function|AbortController|Promise|SincoInitializationError|Sinco|s5'.split('|').reduce(fnWordRegex, ''),
            'fn': ([match]) => `<span class="object">${match}</span>`
        },
        {
            'regex': '\\/\\*',
            'fn': ([match]) => `<span class="comment">${match}`
        },
        {
            'regex': '\\*\\/',
            'fn': ([match]) => `${match}</span>`
        },
        {
            'regex': '([^:]|^)\\/\\/.*',
            'fn': ([match]) => `<span class="comment">${match}</span>`
        },
        {
            'regex': '\\b(\\d)+\\b',
            'fn': ([match]) => `<span class="number">${match}</span>`
        },
        {
            'regex': '\\*|\\s\\/(\\s+)|\\;|\\.|\\)|\\(|\\[|\\]|\\{|\\}|\\+|\\-|\\`|\\,|\\s\\<(\\s)+|\\s\\>\\s|\\s\\>\\=(\\s)*|\\s\\<\\=\\s|\\s\\!\\=\\s|\\s\\!\\=\\=\\s|\\s\\=\\=\\s|\\s\\=\\=\\=\\s|\\s\\=\\>(\\s)*|\\!|\\&|\\%|\\||\\s(\\=)+\\s*',
            'fn': ([match]) => `<span class="character">${match}</span>`
        }
    ];

    const showCode = (linesElement, codeElement) => (code, lines) => {
        types.forEach(type => {
            const reg = new RegExp(type.regex, 'g');
            
            if (reg.test(code)){
                code = code.replace(reg, (x, y, z) => 
                                        type.fn ? 
                                        type.fn([x,y,z]) : 
                                        type.replaceWith.format(x)
                                    );
            }
        });
        codeElement.innerHTML = replaceAll(replaceAll(replaceAll(code, '_lt_', '&lt;'), '_gt_', '&gt;'), '_PAT_', '<span class="regex">/[$/:-?{-~!"^`\\[\\]#.\\s]/</span>');
        linesElement.innerHTML = lines.join('<br />');
        window['onLoadEnd']();
    };

    const solicitarRecurso = (lines, code, showCode) => async url => {
        try {
            const { status, data } = await s5.hr.get(url, { contentType: 'text' });
            if (status === 200) {
                const numberLines = data.split('\n').map((c, i) => `<span class="code-line">${(i+1)}</span>`);
                showCode(
                    replaceAll(data, '\\<(\\/)*.+\\>', c => replaceAll(replaceAll(c, '>', '_gt_'), '<', '_lt_'))
                        .split('/[$/:-?{-~!"^`\\[\\]#.\\s]/')
                        .join('_PAT_'), 
                    numberLines
                );
            }
        }
        catch(e) {
            code.innerHTML = `<span class="comment">// No se puede cargar el recurso: ${url}</span><br /><span class="comment">// verifique los mensajes en consola</span><br /><span class="comment">// ${JSON.stringify(e)}</span>`;
            lines.innerHTML = '<span class="code-line">1</span><br /><span class="code-line">2</span><br /><span class="code-line">3</span>';
            alert(e);
        }
    };

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

        const lines = s5.createElem('pre', { 'id': 'lines' });
        const code = s5.createElem('pre', { 'id': 'code' }).insert(document.createTextNode('Cargando código...'));

        const codeContainer = s5.createElem('div', { 'id': 'code-container' }).insert([
            titulo,
            s5.createElem('section', { 'id': 'lines-code-container' }).insert([
                lines,
                code
            ])
        ]);

        solicitarRecurso(lines, code, showCode(lines, code))(url);

        return codeContainer;
    };

    return {
        init: scriptUrl => crearDiseno(urlBase + scriptUrl)
    };
});