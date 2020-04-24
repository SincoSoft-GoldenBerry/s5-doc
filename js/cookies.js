(w => {
    w['readCookie'] = name => {
        name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    
        const regex = new RegExp(`(?:^|;)\\s?${name}=(.*?)(?:;|$)`, 'i'),
            match = document.cookie.match(regex);
    
        return match && unescape(match[1]);
    };

    const deleteAllCookies = () => {
        const cookies = document.cookie.split(";");

        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
    }

    w['writeCookie'] = (name, value) => {
        deleteAllCookies();
        const fecha = new Date();
        fecha.setFullYear(fecha.getFullYear() + 1);
        document.cookie = `${name}=${value};expires=${fecha.toGMTString()}`;
    };
})(window);