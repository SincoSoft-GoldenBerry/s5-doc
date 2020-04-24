window['app'].define('modal', [], () => {

    const close = () => {
        const modal = s5.get('container-bg');
        if (modal)
            modal.delete();
    };

    const init = (title, content, minwidth) => {
        minwidth = minwidth || '40%';
        close();

        const btnCerrar = s5.createElem('button', { 'type': 'button', 'class': 'btn success' })
                            .insert(s5.createElem('i', { 'class': 'fa fa-times' }));
    
        const modal = s5.createElem('aside', { 'id': 'container-bg' })
                    .insert(
                        s5.createElem('div', { 'id': 'dvModal', 'style': `min-width: ${minwidth};` })
                            .insert([
                                s5.createElem('div', { 'class': 'modal-title', 'id': 'titulo' }).insert([
                                    document.createTextNode(title),
                                    btnCerrar
                                ]),
                                s5.createElem('div', { 'class': 'modal-body' }).insert(content)
                            ])
                    );

                    
        document.body.appendChild(modal);

        modal.addEventListener('click', close);
        btnCerrar.addEventListener('click', close);

        modal.get('div, *:not(.btn):not(.fa)').forEach(element => 
            element.addEventListener('click', e => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, false)
        );

        window.addEventListener('keyup', e => {
            if (e.keyCode === 27) {//Esc
                close();
            } 
        });

        new s5.utilities.dragDrop('dvModal', 'container-bg', 'titulo');
    };

    return {
        show: init,
        close
    };
});
