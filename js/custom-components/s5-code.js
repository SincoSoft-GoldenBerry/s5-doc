class CodeViewer extends HTMLElement {

    constructor() {
        super();

        this._online = null;

        this._defineShadow();
    }

    _defineShadow() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('section');

        this.lines = document.createElement('pre');
        this.lines.classList.add('lines');
        this.code = document.createElement('pre');
        this.code.classList.add('code');

        this.wrapper.appendChild(this.lines);
        this.wrapper.appendChild(this.code);

        const css = document.createElement('style');
        css.innerHTML = `
            @import "css/fa/css/all.css";
            @import "css/custom-components/s5-code.css";
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    loadCode(data) {
        const fnWordRegex = (s, a) => `${s !== '' ? s + '|' : s}[^.]\\b(${a})\\b`;
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

        const replaceAll = (_this, rThis, rWith) => _this.replace(new RegExp(rThis, 'g'), rWith);

        this.lines.innerHTML = data.split('\n').map((c, i) => `<span class="code-line">${(i+1)}</span>`).join('<br />');

        data = replaceAll(data, '\\<(\\/)*.+\\>', c => replaceAll(replaceAll(c, '>', '_gt_'), '<', '_lt_'))
                .split('/[$/:-?{-~!"^`\\[\\]#.\\s]/')
                .join('_PAT_');

        types.forEach(type => {
            const reg = new RegExp(type.regex, 'g');
            
            if (reg.test(data)){
                data = data.replace(reg, (x, y, z) => type.fn([x,y,z]));
            }
        });

        this.code.innerHTML = replaceAll(replaceAll(replaceAll(data, '_lt_', '&lt;'), '_gt_', '&gt;'), '_PAT_', '<span class="regex">/[$/:-?{-~!"^`\\[\\]#.\\s]/</span>');

        const event = new Event('codeshow', { bubbles: true });
        this.dispatchEvent(event);
    }
}

customElements.define('s5-code', CodeViewer);