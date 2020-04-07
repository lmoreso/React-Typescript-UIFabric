export enum origenesDatos { ninguno, rest, json, jsonret };
export const URL_PAISES = 'http://restcountries.eu/rest/v1/all';
export const JSON_PAISES = './recursos/countries.json';
const datosJSON = require('./recursos/countries.json');

export async function DescargarPaises(origen: origenesDatos): Promise<any> {
    switch (origen) {
        case origenesDatos.jsonret:
            return new Promise((resolve) => { 
                setTimeout(function(){
                    resolve(datosJSON);
               }, 2000);               
            })
        case origenesDatos.json:
            return new Promise((resolve) => { resolve(datosJSON); })
        case origenesDatos.rest:
            return new Promise((resolve, reject) => {
                fetch(URL_PAISES)
                    .then(res => {
                        if (res) {
                            // console.log(res);
                            resolve(res.json());
                        } else {
                            reject(`La url ${URL_PAISES}, no ha devuelto nada.`);
                        }
                    })
                    .catch(err => {
                        // console.log(`El error ha llegado al catch`, err);
                        reject(err);
                    });
            });
        default:
            return new Promise((resolve) => { resolve([]); })
        // throw "El Origen de Datos no es válido";
    }
}
