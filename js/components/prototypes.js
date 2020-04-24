window['app'].define('components/prototypes', [], () => {

    String.formata = String.prototype.formata = function () {
        var i = 0, l = 0;
        var string = (typeof (this) == 'function' && !(i++)) ? arguments[0] : this;

        while (i < arguments.length) {
            string = string.replace(new RegExp('\\{' + l + '\\}', 'g'), arguments[i]);
            //string = string.replaceAll('\\{' + l + '\\}', arguments[i]);
            i++; l++;
        }

        return string;
    };


    return {
        get: () => {
            let code;
            try {
                code = 'texto {0}'.formata('0');
            }
            catch(e) {
                code = e;
            }
            return s5.createElem('div', { 'class': 'proto-container' }).insert([
                document.createTextNode('"texto {0}".format("0")'),
                document.createElement('br'),
                document.createTextNode(code)
            ]);
        }
    }
});