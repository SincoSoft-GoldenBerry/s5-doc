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
        /*Tomado de css/scroll.css*/

        ::-webkit-scrollbar {
            height: 16px;
            overflow: visible;
            width: 16px;
        }
        
        ::-webkit-scrollbar-button {
            height: 0;
            width: 0;
        }
        
        ::-webkit-scrollbar-track {
            background-clip: padding-box;
            border: solid transparent;
            border-width: 0 0 0 4px;
            background-color: rgba(76, 76, 76, 0.6);
        }
        
        ::-webkit-scrollbar-track:horizontal {
            border-width: 4px 0 0;
        }
        
        ::-webkit-scrollbar-track:hover {
            background-color: rgba(76, 76, 76, 0.8);
            box-shadow: inset 1px 0 0 rgba(255, 255, 255, .1);
        }
        
        ::-webkit-scrollbar-track:horizontal:hover {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);
        }
        
        ::-webkit-scrollbar-track:active {
            background-color: rgba(76, 76, 76, 0.8);
            box-shadow: inset 1px 0 0 rgba(255, 255, 255, .14), inset -1px 0 0 rgba(255, 255, 255, .07);
        }
        
        ::-webkit-scrollbar-track:horizontal:active {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, .14), inset 0 -1px 0 rgba(255, 255, 255, .07);
        }
        
        ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, .2);
            background-clip: padding-box;
            border: solid transparent;
            border-width: 1px 1px 1px 6px;
            min-height: 28px;
            padding: 100px 0 0;
            box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1), inset 0 -1px 0 rgba(0, 0, 0, .07);
        }
        
        ::-webkit-scrollbar-thumb:horizontal {
            border-width: 6px 1px 1px;
            padding: 0 0 0 100px;
            box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .1), inset -1px 0 0 rgba(0, 0, 0, .07);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, .4);
            box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .25);
        }
        
        ::-webkit-scrollbar-thumb:active {
            background-color: rgba(0, 0, 0, 0.5);
            box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.35);
        }
        
        ::-webkit-scrollbar-corner {
            background: transparent;
        }

        section {
            display: flex;
            border-radius: 5px;
            background-color: #1e1e1e;
        }
        
        .lines {
            max-width: 80px;
            padding: 15px 7px 15px 10px;
            text-align: right;
            width: inherit;
            box-sizing: border-box;
            overflow: hidden;
        }
        
        .code-line { color: #A0A0A0; }
        
        pre, .normal { color: #93b6ee; }
        
        pre {
            font-size: .8em;
            width: 100%;
            margin: 0;
            padding: 15px;
            overflow-x: auto;
            background-color: #1e1e1e;
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
        
        const n = this.code.innerHTML.match(/\n/g).length + 1;
        this.lines.innerHTML = Array.from(Array(n), (c, i) => `<span class="code-line">${(i+1)}</span>`).join('<br />');

        const event = new Event('codeshow', { bubbles: true });
        this.dispatchEvent(event);
    }
}

customElements.define('s5-code', CodeViewer);