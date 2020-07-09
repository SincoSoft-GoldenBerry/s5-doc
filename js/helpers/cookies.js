export class Cookies {
    read(name) {
        name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    
        const regex = new RegExp(`(?:^|;)\\s?${name}=(.*?)(?:;|$)`, 'i');

        const match = document.cookie.match(regex);
    
        return match && unescape(match[1]);
    }

    _deleteAll() {
        const cookies = document.cookie.split(";");

        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
    }

    write(name, value) {
        this._deleteAll();
        const fecha = new Date();
        fecha.setFullYear(fecha.getFullYear() + 1);
        document.cookie = `${name}=${value};expires=${fecha.toGMTString()}`;
    }
}