export enum origenesDatos { ninguno, rest, json };
const URL_PAISES = 'http://restcountries.eu/rest/v1/all';
const datosJSON = require('./recursos/countries.json');

export async function DescargarPaises(origen: origenesDatos): Promise<any> {
    switch (origen) {
        case origenesDatos.json:
            return new Promise((resolve) => { resolve(datosJSON); })
        case origenesDatos.rest:
            return new Promise((resolve, reject) => {
                fetch(URL_PAISES)
                    .then(res => {
                        // console.log(res);
                        if (res) {
                            resolve(res.json());
                        } else {
                            reject(`La url ${URL_PAISES}, no ha devuelto nada.`);
                        }
                    })
                    .catch(err => {
                        console.log(`El errror ha llegado al catch`, err);
                        reject(err);
                    });
            });
        default:
            throw "El Origen de Datos no es válido";
    }
}
