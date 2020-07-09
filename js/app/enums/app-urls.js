export class AppUrls {
    static cdn = {
        API: {
            url: 'https://data.jsdelivr.com/v1/package/npm/s5-js',
            fnUrl: v => `https://data.jsdelivr.com/v1/package/npm/s5-js@${v}`,
            type: { contentType: 'text' }
        },
        base: 'https://cdn.jsdelivr.net/npm/s5-js'
    };
    static worker = {
        url: './sw.js',
        props: {
            scope: './'
        }
    };
}