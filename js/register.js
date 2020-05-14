(async () => {
return

    if ('serviceWorker' in navigator) {
        let newWorker;
    
        const newVersion = s5('.new-version').shift()
                                .addEvent('click', () => newWorker.postMessage({ action: 'skipWaiting' }));

        try {
            const worker = await navigator.serviceWorker.register('./sw.js', { scope: './' });

            worker.addEventListener('updatefound', () => {
                newWorker = worker.installing;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        newVersion.classList.remove('hidden');
                    }
                });
            });
        }
        catch (err) {
            console.log('El service worker no se instaló!', err);
        }

        let refreshing;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

})();