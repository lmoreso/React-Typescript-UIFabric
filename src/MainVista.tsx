import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { DescargarPaises, origenesDatos } from './Modelo';
import { IDebugListConfig, DebugList, DebugListRenderTable, DebugListRenderTxt } from './VDebugList';
import { DetailsListDocumentsExample } from './DetailListDocumentsExample';


enum menuOptionsId { debugListTable = 1, debugListTxt, fabricListDocExample }
const DEF_MENU_ID: menuOptionsId = menuOptionsId.debugListTable;
const DEF_ORG_DAT: origenesDatos = origenesDatos.rest;

interface IMenuOptions {
  key: menuOptionsId;
  name: string;
  loadCountries: boolean;
}

const menuOptions: IMenuOptions[] = [
  { key: menuOptionsId.debugListTable, name: 'Tabla HTML de DebugList', loadCountries: true },
  { key: menuOptionsId.debugListTxt, name: 'Texto "tabulado" de DebugList', loadCountries: true },
  { key: menuOptionsId.fabricListDocExample, name: 'Ejemplo de Lista de UI Fabric', loadCountries: false },
]

export interface IGetDataExampleProps {

};

enum fetchStatus { Cargando, Cargado, Error }

export interface IGetRestExampleState {
  numRegs: number;
  estado: fetchStatus;
  mensaje: string;
  activeMenuOptionId: menuOptionsId;
  origenDatos: origenesDatos;
}

export interface IPaisCol {
  titulo: string;
  campo: string;
  width: number;
}

export const PAISES: IPaisCol[] = [
  { titulo: "Abrev.", campo: "alpha3Code", width: 3 },
  { titulo: "Country", campo: "name", width: 20 },
  { titulo: "Pais", campo: "Pais", width: 20 },
  { titulo: "Nombre Nativo", campo: "nativeName", width: 40 },
  { titulo: "Capital", campo: "capital", width: 30 },
  { titulo: "Continente", campo: "region", width: 30 },
  { titulo: "Región", campo: "subregion", width: 30 },
  { titulo: "Idiomas", campo: "languages", width: 20 },
  { titulo: "Nº Husos", campo: "numHusos", width: 8 },
]

export class GetRestExample extends React.Component<IGetDataExampleProps, IGetRestExampleState> {
  private _data: any[];
  private _dbgListRows: IDebugListConfig[];
  private _dbgList: DebugList;
  private _isMenuActive = (menuOptionId: menuOptionsId): boolean => (this.state.activeMenuOptionId === menuOptionId);
  private _getActiveMenuOption = (): IMenuOptions => {
    let menuOption = menuOptions.find((value: IMenuOptions, index, obj) => (this._isMenuActive(value.key)));
    if (menuOption == undefined) throw `No hay ninguna opción seleccionada`
    return (menuOption);
  }
  private _optionsComboMenu: { key: number; text: string }[];


  public constructor(props: IGetDataExampleProps) {
    super(props);

    // Inicializar estados
    this.state = { numRegs: 0, estado: fetchStatus.Cargando, mensaje: '', activeMenuOptionId: DEF_MENU_ID, origenDatos: DEF_ORG_DAT }

    // Inicializar las columnas para el DebugList
    if (this._getActiveMenuOption().loadCountries) {
      this._dbgListRows = new Array<IDebugListConfig>();
      PAISES.forEach((unPais: IPaisCol, indice) => {
        this._dbgListRows.push({ key: indice.toString(), tituloColumna: unPais.titulo, anchoColumna: unPais.width, nombreColumna: unPais.campo });
      })
      this._dbgList = new DebugList("Lista de Paises", this._dbgListRows)
    }

    // Rellenar opciones para el combo de las opciones de menú
    this._optionsComboMenu = new Array();
    menuOptions.forEach((unMenu => {
      this._optionsComboMenu.push({ key: unMenu.key, text: unMenu.name })
    }))
  }

  public componentDidMount() {
    if (this._getActiveMenuOption().loadCountries) {
      this.setState({ estado: fetchStatus.Cargando, });
      // DescargarPaises(origenesDatos.ninguno)
      DescargarPaises(this.state.origenDatos)
        .then((datos) => {
          this._data = datos;
          this._data.forEach((registro, indice) => {
            registro.key = indice.toString();
            registro.Pais = registro.translations.es;
            registro.numHusos = registro.timezones.length;
          })
          console.log(this._data[5]);
          this.setState({ numRegs: datos.length, estado: fetchStatus.Cargado });
        })
        .catch((err) => {
          // console.log(`Error en la vista: ${err}`);
          this.setState({ numRegs: 0, estado: fetchStatus.Error, mensaje: err });
        });
    } else {
      this.setState({ estado: fetchStatus.Cargado, });
    }
  }

  private _onChangeComboMenu = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({ activeMenuOptionId: item.key as menuOptionsId });
  };

  public render(): JSX.Element {
    console.log('this.state.activeMenuOptionId', this.state.activeMenuOptionId);
    if (this._getActiveMenuOption().loadCountries && this.state.estado == fetchStatus.Cargando) {
      return (
        <div>
          <Label>Cargando ...</Label>
          <Spinner size={SpinnerSize.large} />
        </div>
      );
    } else if (this._getActiveMenuOption().loadCountries && this.state.estado == fetchStatus.Error) {
      return (
        <div>
          <h1>Se ha producido un error:</h1>
          <p>{this.state.mensaje}</p>
        </div>
      );
    } else {
      if (this._getActiveMenuOption().loadCountries && this.state.numRegs == 0) {
        return (
          <div>
            <h1>No hay registros ...</h1>
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5px', alignSelf: 'center', backgroundColor: 'rgba(150, 150, 150,.5)', width:'100%' }}>
                <Label style={{ padding: '5px', paddingTop: '10px' }}> Selecciona una opción: </Label>
                <Dropdown
                  // defaultSelectedKey={this.state.activeMenuOptionId ? this.state.activeMenuOptionId : undefined}
                  selectedKey={this.state.activeMenuOptionId ? this.state.activeMenuOptionId : undefined}
                  onChange={this._onChangeComboMenu}
                  placeholder="Select an option"
                  options={this._optionsComboMenu}
                  styles={{ dropdown: { width: 300, padding: '5px' } }}

                />
              </div>
              <div style={{ padding: '5px', alignSelf: 'center' }}> 
                {
                  (this._getActiveMenuOption().loadCountries && this.state.origenDatos == origenesDatos.json) ?
                    <h4>Se han encontrado {this.state.numRegs} paises en el archivo JSON</h4>
                    : (this._getActiveMenuOption().loadCountries) ?
                      <h4>Se han encontrado {this.state.numRegs} paises en la URL</h4>
                      : null
                }
                <DebugListRenderTxt
                  list={this._dbgList}
                  datos={this._data}
                  hidden={!this._isMenuActive(menuOptionsId.debugListTxt)}
                />
                <DebugListRenderTable
                  list={this._dbgList}
                  datos={this._data}
                  hidden={!this._isMenuActive(menuOptionsId.debugListTable)}
                />
                <DetailsListDocumentsExample
                  hidden={!this._isMenuActive(menuOptionsId.fabricListDocExample)}
                />
              </div>
            </div>
          </div>
        );
      }
    }
  }
}
