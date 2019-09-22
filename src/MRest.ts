export async function GetRestEjemplo(url: string): Promise<any[]> {
    // let datos: any[];

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => {
                // console.log(res);
                if (res) {
                    resolve(res.json());
                } else {
                    reject(`La url ${url}, no ha devuelto ningún array.`);
                }
            })
            .catch((err) => {
                console.log(`Ha llegado aL CATCH`, err);
                reject(err);
            })
        // .then((data) => {
        //     //console.log(`Datos obtenidos`, data);
        //     resolve(data);

        // })
        // .catch((err: string) => {
        //     reject (err);
        // })
    });



}

