﻿(w => {
    const fn = () => {
        let mode = w['readCookie']('view') || 'light';
        const hashes = w.location.hash.split('#');
        const comparer = h => h.includes('theme');
        const metas = document.querySelectorAll('.meta-theme');
        let color = '#f8f8f8';

        if (hashes.some(comparer)) {
            mode = hashes.find(comparer).split('=')[1];
            w['writeCookie']('view', mode);
            w.location.href = w.location.href
                .replace(`#theme=${mode}`, '')
                .replace(`%23theme=${mode}`, '');
        }
        document.body.className = '';
        if (mode === 'light') {
            w['writeCookie']('view', 'light');
            document.body.classList.add('light');
        }
        else {
            document.body.classList.add('dark');
            document.head.querySelector('#theme').href = 'css/variables/dark.css';
            color = '#0a0a0a';
        }
        metas.forEach(m => m.setAttribute('content', color));

        document.body.loaded = true;
    };

    let inte;
    inte = setInterval(() => {
        if (document.body && w['readCookie']) {
            clearInterval(inte);
            fn();
        }
    }, 1);

})(window);