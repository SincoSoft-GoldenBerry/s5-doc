window['app'].define('index', [], () => {
    const _init = () => {
        const container = s5('<section>', { 'class': 'index-container' });
        const logoContainer = s5('<section>', { 'class': 'index-logo-container' });
        const nameButtonsContainer = s5('<section>', { 'class': 'index-nb-container' });
        const nameContainer = s5('<section>', { 'class': 'index-name-container' });
        const buttonsContainer = s5('<section>', { 'class': 'index-buttons-container' });

        const name1 = s5('<span>').insert(document.createTextNode('El Framework JavaScript'));
        const name2 = s5('<span>').insert(document.createTextNode('de todo SincoSoft'));

        nameContainer.insert([name1, name2]);

        //buttonsContainer.insert(s5('<button>').insert(document.createTextNode('GET')));

        //logoContainer.insert(s5('<img>', { 'src': 'images/Logo_S5_square.png', 'alt': 's5' }));

        nameButtonsContainer.insert([nameContainer, buttonsContainer]);
        //window['onLoadEnd']();
        return container.insert([logoContainer, nameButtonsContainer]);
    };
    
    return {
        init: _init
    };

});