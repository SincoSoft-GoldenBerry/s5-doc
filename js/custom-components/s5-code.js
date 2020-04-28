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
        section {
            display: flex;
            border-radius: 5px;
            background-color: #1e1e1e;
        }
        
        .lines {
            width: 50px;
            padding: 15px 5px;
            text-align: right;
        }
        
        .code-line { color: #A0A0A0; }
        
        pre, .normal { color: #93b6ee; }
        
        pre {
            font-size: .8em;
            width: 100%;
            margin: 0;
            padding: 15px;
            overflow-x: auto;
        }
        
        .character { color: #FFFFFF; }
        
        .reserved_a { color: #2b5391; }
        
        .reserved_b { color: #bc8aa3; }
        
        .object { color: #6bb8a8; }
        
        .number { color: #c3c69b; }
        
        .method { color: #dfd9a7; }
        
        .string, .string *, .regex, .regex * { color: #c1917d; }
        
        .comment, .comment * { color: #666666; }
        
        @media (max-width: 700px) {
            section { border-radius: 0; }
        }
        `;

        shadow.appendChild(css);
        shadow.appendChild(this.wrapper);
    }

    async loadCode(data) {
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