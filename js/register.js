(async () => {
    let newWorker;

    const newVersion = s5.get('.new-version').shift();

    newVersion.addEvent('click', () => newWorker.postMessage({ action: 'skipWaiting' }));

    if ('serviceWorker' in navigator) {
        try {
            const worker = await navigator.serviceWorker.register('./sw.js');

            worker.addEventListener('updatefound', () => {
                newWorker = worker.installing;

                newWorker.addEventListener('statechange', () => {
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                newVersion.classList.remove('hidden');
                            }
                            break;
                    }
                });
            });
        }
        catch (err) {
            console.log('El service worker no se instaló!', err);
        }
    }

    let refreshing;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });

})();