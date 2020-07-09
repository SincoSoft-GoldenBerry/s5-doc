window['app'].define('components/otros', [], () => {
    return {
        get: () => {
            //Espacio para SincoInitializationError, isIE, etc
            return s5('<div>', { 'class': 'proto-container' });
        }
    }
});