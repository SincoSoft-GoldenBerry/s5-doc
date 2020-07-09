window['app'].define('who', [], () => {
    return {
        init: function() {
            window['onLoadEnd']();
            return s5('<div>');
        }
    };
});