import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { GetRestEjemplo } from './MRest';

export interface IGetRestExampleProps {

};

enum fetchStatus { Cargando, Cargado, Error }

export interface IGetRestExampleState {
    numRegs: number;
    estado: fetchStatus;
    mensaje: string;
};


export class GetRestExample extends React.Component<IGetRestExampleProps, IGetRestExampleState> {
    private _data: any[];
    public constructor(props: IGetRestExampleProps) {
        super(props);
        this.state = { numRegs: 0, estado: fetchStatus.Cargando, mensaje: '' }
    }

    public componentDidMount() {
        this.setState({ estado: fetchStatus.Cargando });
        GetRestEjemplo('http://restcountries.eu/rest/v1/all')
            .then((datos) => {
                this._data = datos;
                console.log(this._data);
                this.setState({ numRegs: datos.length, estado: fetchStatus.Cargado });
            })
            .catch((err) => {
                // console.log(`Error en la vista: ${err}`);
                this.setState({ numRegs: 0, estado: fetchStatus.Error, mensaje: err });
            });
    }

    public render(): JSX.Element {

        if (this.state.estado == fetchStatus.Cargando) {
            return (
                <div>
                    <Label>Cargando ...</Label>
                    <Spinner size={SpinnerSize.large} />
                </div>
            );
        } else if (this.state.estado == fetchStatus.Error) {
            return (
                <div>
                    <h1>Se ha producido un error:</h1>
                    <p>{this.state.mensaje}</p>
                </div>
            );
        } else {
            if (this.state.numRegs == 0) {
                return (
                    <div>
                        <h1>No hay registros ...</h1>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h1>{`Se han encontrado ${this.state.numRegs} Registros`}</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Indice</th>
                                    <th>Pais</th>
                                </tr>
                                {this._data.map((valor, indice) => {
                                    // return (<p key={indce.tioString()}>{`Nº ${indice}: ${valor.name}`}</p>);
                                    return (
                                        <tr key={indice.toString()}>
                                            <td>{indice.toString()}</td>
                                            <td>{valor.name}</td>
                                        </tr>
                                    );
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                );
            }
        }
    }
}  