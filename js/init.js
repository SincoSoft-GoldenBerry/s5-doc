(w => {
    const footer = s5('footer.bottom').shift();
    const nav = s5('nav').cloneNode(true);
    const sideBar = s5('.sidebar-menu').shift().insert(nav);
    const container = s5('.content').shift();
    const navLinks = s5('.nav-link');
    const currentMode = document.body.className;
    const modal = s5('modal');
      
    const cargaInicial = () => {
        nav.removeAttribute('id');
        nav.classList.add('main-menu');

        w['onLoadEnd'] = () => footer.classList.remove('bottom');

        s5('.year').forEach(el => el.innerHTML = new Date().getFullYear());

        const asignarVersion = ({app}) => s5('.version').forEach(el => el.innerHTML = `versión: ${app}`);

        if (!window['app-version']) {
            s5.watch(window, 'app-version', () => asignarVersion(window['app-version']));
        }
        else {
            asignarVersion(window['app-version']);
        }
        
        s5('a[mode]').addEvent('click', e => {
            const mode = e.target.getAttribute('mode');
            w['writeCookie']('view', mode);
            w.location.reload();
        });
        s5('.navbar-button').addEvent('click', () => sideBar.classList.toggle('visible'));
        s5('.nav-link[mode]').forEach(t => {
            if (t.attribute('mode') === currentMode) {
                t.parentNode.classList.add('theme');
            }
            else {
                t.parentNode.classList.remove('theme');
            }
        });
        s5('.current-theme').forEach(themeIcon => {
            themeIcon.className = '';
            themeIcon.className = `fa fa-${currentMode === 'dark' ? 'moon' : 'sun'}`;

            themeIcon.parentNode.setAttribute('title', `Tema actual: ${currentMode}`);
        });

        s5('.img-logo > img').forEach(img => img.attribute('src', `images/${currentMode}-Logo_S5.png`));
    };

    const cargaModulos = () => {
        const modules = ['index', 'components', 'who', 'code'];
        w['app'] = s5.initialize(null, null, 'js');
        w['app'].require([...modules], (...loadedModules) => {

            const limpiar = () => {
                container.innerHTML = '';
                modal.close();

                s5('.current').forEach(c => c.classList.remove('current'));
            };

            const stickyTitle = container => {
                const selector = container.id ? `#${container.id}` : `.${container.className.split(' ').join('.')}`;
                const elements = s5(`${selector} > [class*="title"], ${selector} > [id*="title"]`);
                s5.map(elements, el => el.classList.add('sticky-title'));
                if (elements.length > 0)
                    elements[0].nextSibling.classList.add('sticky-sibling');
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

                stickyTitle(design);
            };

            navegar();

            s5.addEvent.call(w, 'hashchange', navegar);
        });
    };

    cargaInicial();
    cargaModulos();
})(window);