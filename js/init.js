(w => {
    const footer = s5.get('footer.bottom').shift();
    const nav = s5.get('nav').cloneNode(true);
    const sideBar = s5.get('.sidebar-menu').shift().insert(nav);
    const container = s5.get('.content').shift();
    const navLinks = s5.get('.nav-link');
    const currentMode = document.body.className;
    const modal = s5.get('modal');
      
    const cargaInicial = () => {
        nav.removeAttribute('id');
        nav.classList.add('main-menu');

        w['onLoadEnd'] = () => footer.classList.remove('bottom');

        s5.get('.year').forEach(el => el.innerHTML = new Date().getFullYear());
        s5.get('a[mode]').addEvent('click', e => {
            const mode = e.target.getAttribute('mode');
            w['writeCookie']('view', mode);
            w.location.reload();
        });
        s5.get('.navbar-button').addEvent('click', () => sideBar.classList.toggle('visible'));
        s5.get('.nav-link[mode]').forEach(t => {
            if (t.attribute('mode') === currentMode) {
                t.parentNode.classList.add('theme');
            }
            else {
                t.parentNode.classList.remove('theme');
            }
        });
        s5.get('.current-theme').forEach(themeIcon => {
            themeIcon.className = '';
            themeIcon.className = `fa fa-${currentMode === 'dark' ? 'moon' : 'sun'}`;

            themeIcon.parentNode.setAttribute('title', `Tema actual: ${currentMode}`);
        });

        s5.get('.img-logo > img').forEach(img => img.attribute('src', `images/${currentMode}-Logo_S5.png`));
    };

    const cargaModulos = () => {
        const modules = ['index', 'components', 'who', 'code'];
        w['app'] = s5.initialize(null, null, 'js');
        w['app'].require([...modules], (...loadedModules) => {

            const limpiar = () => {
                container.innerHTML = '';
                modal.close();

                s5.get('.current').forEach(c => c.classList.remove('current'));
            };

            const navegar = () => {
                limpiar();

                let option = w.location.hash || '#index';
                navLinks.filter(n => n.attribute('href') === option)
                        .forEach(el => el.parentNode.classList.add('current'));
                option = option.split('-');

                const nombreModulo = option.shift().replace('#', '');

                const design = loadedModules[modules.indexOf(nombreModulo)].init(option.shift());

                sideBar.classList.remove('visible');
            
                container.insert(design);
            };

            navegar();

            s5.addEvent.call(w, 'hashchange', navegar);
        });
    };

    cargaInicial();
    cargaModulos();
})(window);