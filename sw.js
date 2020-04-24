const staticCacheName = 'site-static-v0.1.0';
const dynamicCacheName = 'site-dynamic-v0.1.0';

const limitCacheSize = (name, size) =>
    caches.open(name).then(cache =>
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    );

const assets = [
    './',
    './index.html',
    './offline.html',
    'js/components/prototypes.js',
    'js/components/s5.autocomplete.js',
    'js/components/s5.icons.js',
    'js/custom-components/s5-modal.js',
    'js/code.js',
    'js/components.js',
    'js/cookies.js',
    'js/deprecated-modal.js',
    'js/index.js',
    'js/init.js',
    'js/register.js',
    'js/theme-chooser.js',
    'js/who.js',
    'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/s5.js',
    'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/v2/s5.js',
    'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/s5.request.js',
    'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/s5.icons.js',
    'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/s5.autocomplete.js',
    'https://cdn.jsdelivr.net/gh/SincoSoft-GoldenBerry/S5@master/s5.dragdrop.js',

    'css/components/s5.autocomplete.css',
    'css/components/s5.icons.css',
    'css/custom-components/s5-modal.css',
    'css/fa/css/all.css',
    'css/fa/css/all.min.css',
    'css/fa/css/brands.css',
    'css/fa/css/brands.min.css',
    'css/fa/css/fontawesome.css',
    'css/fa/css/fontawesome.min.css',
    'css/fa/css/regular.css',
    'css/fa/css/regular.min.css',
    'css/fa/css/solid.css',
    'css/fa/css/solid.min.css',
    'css/fa/css/svg-with-js.css',
    'css/fa/css/svg-with-js.min.css',
    'css/fa/css/v4-shims.css',
    'css/fa/css/v4-shims.min.css',

    'css/fa/webfonts/fa-brands-400.eot',
    'css/fa/webfonts/fa-brands-400.svg',
    'css/fa/webfonts/fa-brands-400.ttf',
    'css/fa/webfonts/fa-brands-400.woff',
    'css/fa/webfonts/fa-brands-400.woff2',
    'css/fa/webfonts/fa-regular-400.eot',
    'css/fa/webfonts/fa-regular-400.svg',
    'css/fa/webfonts/fa-regular-400.ttf',
    'css/fa/webfonts/fa-regular-400.woff',
    'css/fa/webfonts/fa-regular-400.woff2',
    'css/fa/webfonts/fa-solid-900.eot',
    'css/fa/webfonts/fa-solid-900.svg',
    'css/fa/webfonts/fa-solid-900.ttf',
    'css/fa/webfonts/fa-solid-900.woff',
    'css/fa/webfonts/fa-solid-900.woff2',
    'css/fonts/antipasto_regular-webfont.eot',
    'css/fonts/antipasto_regular-webfont.svg',
    'css/fonts/antipasto_regular-webfont.ttf',
    'css/fonts/antipasto_regular-webfont.woff',
    'css/fonts/antipasto_regular-webfont.woff2',
    'css/fonts/glyphicons-halflings-regular.eot',
    'css/fonts/glyphicons-halflings-regular.svg',
    'css/fonts/glyphicons-halflings-regular.ttf',
    'css/fonts/glyphicons-halflings-regular.woff',
    'css/fonts/glyphicons-halflings-regular.woff2',
    'css/fonts/roboto-light-webfont.eot',
    'css/fonts/roboto-light-webfont.svg',
    'css/fonts/roboto-light-webfont.ttf',
    'css/fonts/roboto-light-webfont.woff',
    'css/fonts/roboto-light-webfont.woff2',

    'css/variables/buttons.css',
    'css/variables/dark.css',
    'css/variables/light.css',

    'css/code.css',
    'css/component.css',
    'css/content.css',
    'css/default.css',
    'css/deprecated-modal.css',
    'css/footer.css',
    'css/header.css',
    'css/nav.css',

    'images/icons/icon-72x72.png',
    'images/icons/icon-96x96.png',
    'images/icons/icon-114x114.png',
    'images/icons/icon-128x128.png',
    'images/icons/icon-152x152.png',
    'images/icons/icon-192x192.png',
    'images/icons/icon-384x384.png',
    'images/icons/icon-512x512.png',
    'images/arrow-point-to-right.png',
    'images/dark-Logo_S5.png',
    'images/favicon.ico',
    'images/light-Logo_S5.png',
    'images/Logo_S5_square.png'
];

self.addEventListener('install', event =>
    event.waitUntil(
        caches
            .open(staticCacheName)
            .then(cache => cache.addAll(assets))
    )
);

self.addEventListener('activate', event =>
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                    .map(key => caches.delete(key))
            )
        )
    )
);

self.addEventListener('fetch', event =>
    event.respondWith(
        caches
            .match(event.request, { ignoreVary: true })
            .then(cacheRes =>
                cacheRes ||
                fetch(event.request)
                    .then(fetchRes =>
                        caches.open(dynamicCacheName)
                            .then(cache => {
                                cache.put(event.request.url, fetchRes.clone());
                                limitCacheSize(dynamicCacheName, 15);
                                return fetchRes;
                            })
                    )
            )
            .catch(event => {
                if (event.request.url.indexOf('.html') > -1) {
                    return caches.match('./offline.html');
                }
            })
    )
);

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});