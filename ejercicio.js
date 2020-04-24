//solución 1:
const getRepeated1 = (x, y) => {
    let a = x, b = y;
    if (x.length > y.length)
        a = y, b = x;
    return a.reduce((c, n) => {
        if (b.some(j => j === n))
            c.push(n);
        return c;
    }, []).sort((a, b) => b-a);
    //Ordeno para que se vea igual al resultado ejemplo
};
//solucion 2:
const getRepeated2 = (x, y) => x.filter(n => y.includes(n)).sort((a, b) => b - a);
//solución 3:
const getRepeated3 = (x, y) => {
    if (x.length === 0 || y.length === 0) return [];
    x = new Set(x), y = new Set(y);
    let a = x, b = y;
    if (x.size > y.size)
        a = y, b = x;
    let r = [];
    a.forEach(n => {
        if (b.has(n) && b.delete(n)) {
            r.push(n);
        }
    });
    return r;
};
//solución 4:
const getRepeated4 = (x, y) => {
    let a = x, b = y;
    if (x.length > y.length)
        a = y, b = x;
    return a.filter(n => {
        if (b.includes(n)) {
            b.splice(b.indexOf(n), 1);
            return true;
        }
        return false;
    }).sort((a, b) => b - a);
};
//solución 5:
const getRepeated5 = (x, y) => {
    if (x.length === 0 || y.length === 0) return [];
    x = new Set(x), y = new Set(y);
    let a = x, b = y;
    if (x.size > y.size)
        a = y, b = x;
    return [...a].filter(n => b.has(n)).sort((a, b) => b - a);
};
//solución 6:
const getRepeated6 = (x, y) => {
    y = [...new Set(y)];
    return [...new Set(x)].filter(n => y.includes(n)).sort((a, b) => b - a);
};

var arr1 = [4, 7, 1, 6, 20, 5, 2];
var arr2 = [11, 4, 1, 8, 3, 8, 9, 10, 7, 4];

console.time('Uno');
console.log('Solución 1: ', getRepeated1(arr1, arr2));
console.timeEnd('Uno');

console.time('Dos');
console.log('Solución 2: ', getRepeated2(arr1, arr2));
console.timeEnd('Dos');

console.time('Tres');
console.log('Solución 3: ', getRepeated3(arr1, arr2));
console.timeEnd('Tres');

console.time('Cinco');
console.log('Solución 5: ', getRepeated5(arr1, arr2));
console.timeEnd('Cinco');

console.time('Seis');
console.log('Solución 6: ', getRepeated6(arr1, arr2));
console.timeEnd('Seis');

console.time('Cuatro');
console.log('Solución 4: ', getRepeated4(arr1, arr2));
console.timeEnd('Cuatro');







/*
Hacer una función que reciba un entero positivo y haga el siguiente calculo:
Tomar los dígitos del número y sumar el cuadrado de cada uno, repetir el proceso 
hasta que el resultado sea 1, en ese caso retornar true, o retornar falso si el calculo nunca llega a 1.

EJ: Entrada: 19

12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1

Si llega a 1 retornar true si no retornar false
*/

/*const seperarDigitos = v => v.split('').map(x => +x);
const llegaUno = n => seperarDigitos(n)*/

const digitosAlCuadrado = x => x.toString().split('').map(n => Math.pow(n, 2));
const sumarNumero = (ac, x) => { ac += x; return ac; };
const sumarDigitos = a => a.reduce(sumarNumero, 0);
const mostrarReiniciar = m => {
    console.log(m, llegaUno.numeros);
    llegaUno.numeros = [];
};

const llegaUno = n => {
    if (n === 0) return false;
    n = Math.abs(n);
    llegaUno.numeros.push(n);
    if (Number.isInteger(Math.log10(n))) {
        mostrarReiniciar(`El número ${n} es potencia de 10`);
        return true;
    }
    if (n % 5 === 0 && n % 10 !== 0) {
        mostrarReiniciar(`El número ${n} es múltiplo de 5`);
        return false;
    }
    return llegaUno(sumarDigitos(digitosAlCuadrado(n)));
};
llegaUno.numeros = [];