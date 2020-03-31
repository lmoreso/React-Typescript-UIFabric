import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { DescargarPaises, origenesDatos, URL_PAISES, JSON_PAISES } from './Modelo';
import { IDebugListConfig, DebugList, DebugListRenderTable, DebugListRenderTxt } from './lib/SimpleListUIfabric/SimpleList';
import { DetailsListDocumentsExample } from './DetailListDocumentsExample';
import { SimpleListUIFabric } from './lib/SimpleListUIfabric/SimpleListUIFabric';
import { IColumn, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ISimpleListCol } from './lib/SimpleListUIfabric/SimpleListCommon';


enum menuOptionsId { debugListTable = 1, debugListTxt, FabricList, fabricListDocExample }
const DEF_MENU_ID: menuOptionsId = menuOptionsId.FabricList;
const DEF_ORG_DAT: origenesDatos = origenesDatos.rest;
// const URL_FLAGS_WIKI = 'https://en.wikipedia.org/wiki/File:Flag_of_'
// const URL_FLAGS_SEP_WIKI = '_';
// const URL_FLAGS_EXT_WIKI = 'svg';
// const URL_FLAGS_FLAGSHUB = 'http://flagshub.com/images/flag-of-'
// const URL_FLAGS_SEP_FLAGSHUB = '-';
// const URL_FLAGS_EXT_FLAGSHUB = 'png';
// const URL_FLAGS = 'http://flagshub.com/images/flag-of-';
// const URL_FLAGS_SEP = '-';
// const URL_FLAGS_EXT = 'png';
const URL_FLAGS = 'https://restcountries.eu/data/';
// const URL_FLAGS_SEP = '@@';
const URL_FLAGS_EXT = 'svg';

const URL_MAPS = 'https://maps.google.com/?q=';


interface IMenuOptions {
  key: menuOptionsId;
  name: string;
  loadCountries: boolean;
}

const menuOptions: IMenuOptions[] = [
  { key: menuOptionsId.debugListTable, name: 'Tabla HTML de DebugList', loadCountries: true },
  { key: menuOptionsId.debugListTxt, name: 'Texto "tabulado" de DebugList', loadCountries: true },
  { key: menuOptionsId.FabricList, name: 'Lista de UI Fabric', loadCountries: true },
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

export const COLUMNS_DEF: ISimpleListCol[] = [
  // { titulo: "Key", campo: "key", width: 10 },
  // { titulo: "Bandera", campo: "flag", width: 10, isImage: true },
  { titulo: "Bandera", campo: "banderaUrl", width: 10, isImage: true },
  { titulo: "Siglas", campo: "alpha3Code", width: 10, campoUrl: "banderaUrl" },
  { titulo: "Nombre Inglés", campo: "name", width: 40, campoUrl: "wikiEnUrl" },
  { titulo: "Nombre Español", campo: "Pais", width: 40, campoUrl: "wikiEsUrl" },
  { titulo: "Nombre Nativo", campo: "nativeName", width: 40, campoUrl: "mapsPaisUrl"  },
  { titulo: "Capital", campo: "capital", width: 20, campoUrl: "mapsCapitalUrl" },
  { titulo: "Continente", campo: "region", width: 20, campoUrl: "mapsContinenteUrl" },
  { titulo: "Región", campo: "subregion", width: 30, campoUrl: "mapsRegionUrl" },
  { titulo: "Idiomas", campo: "idiomas", width: 20 },
  { titulo: "Nº Husos", campo: "numHusos", width: 12, campoTooltip: 'husosTooltip' },
]

export const optionsComboDB: { key: number; text: string }[] = [
  { key: origenesDatos.ninguno, text: 'Ninguno' },
  { key: origenesDatos.rest, text: `URL (${URL_PAISES})` },
  { key: origenesDatos.json, text: `Archivo JSON (${JSON_PAISES})` },
  { key: origenesDatos.jsonret, text: `Archivo JSON (con retraso añadido)` },
];

export class GetRestExample extends React.Component<IGetDataExampleProps, IGetRestExampleState> {
  private _data: any[];
  private _dbgListRows: IDebugListConfig[];
  private _dbgList: DebugList;
  private _columns: IColumn[];
  private _isMenuActive = (menuOptionId: menuOptionsId): boolean => (this.state.activeMenuOptionId === menuOptionId);
  private _getActiveMenuOption = (): IMenuOptions => {
    let menuOption = menuOptions.find((value: IMenuOptions, index, obj) => (this._isMenuActive(value.key)));
    if (menuOption == undefined) throw `No hay ninguna opción seleccionada`;
    return (menuOption);
  }
  private _optionsComboMenu: { key: number; text: string }[];

  public constructor(props: IGetDataExampleProps) {
    super(props);

    // Inicializar estados
    this.state = { numRegs: 0, estado: fetchStatus.Cargando, mensaje: '', activeMenuOptionId: DEF_MENU_ID, origenDatos: DEF_ORG_DAT }

    // Inicializar las columnas para el DebugList y para el DetailList
    if (this._getActiveMenuOption().loadCountries) {
      this._dbgListRows = new Array<IDebugListConfig>();
      this._columns = new Array<IColumn>();
      COLUMNS_DEF.forEach((unPais: ISimpleListCol, indice) => {
        this._dbgListRows.push({
          key: indice.toString(),
          tituloColumna: unPais.titulo,
          anchoColumna: unPais.width,
          nombreColumna: unPais.campo,
          tooltipColumna: (unPais.campoTooltip) ? unPais.campoTooltip : undefined,
          linkColumna: (unPais.campoUrl) ? unPais.campoUrl : undefined,
        });
        this._columns.push({
          key: indice.toString(),
          name: unPais.titulo,
          fieldName: unPais.campo,
          minWidth: unPais.width * 3,
          // maxWidth: unPais.width * 2,
          // isRowHeader: true,
          isResizable: true,
          columnActionsMode: ColumnActionsMode.clickable,
          // isSorted: true,
          // isSortedDescending: false,
          // sortAscendingAriaLabel: 'Sorted A to Z',
          // sortDescendingAriaLabel: 'Sorted Z to A',
          // onColumnClick: this._onColumnClick,
          data: 'string',
          isPadded: true
        });
      })
      this._dbgList = new DebugList("Lista de Paises (se han encontrado %n paises)", this._dbgListRows)
    }

    // Rellenar opciones para el combo de las opciones de menú
    this._optionsComboMenu = new Array();
    menuOptions.forEach((unMenu => {
      this._optionsComboMenu.push({ key: unMenu.key, text: unMenu.name })
    }))

  }

  private _descargarPaises(origenDatos: origenesDatos) {
    this.setState({ estado: fetchStatus.Cargando, origenDatos: origenDatos });
    // DescargarPaises(origenesDatos.ninguno)
    DescargarPaises(origenDatos)
      .then((datos) => {
        console.log(datos);
        this._data = datos;
        this._data.forEach((registro, indice) => {
          registro.key = indice.toString();
          registro.Pais = registro.translations.es;
          registro.numHusos = registro.timezones.length;
          registro.idiomas = (Array.isArray(registro.languages)) ? registro.languages.join(', ') : registro.languages;
          registro.husosTooltip = (Array.isArray(registro.timezones) ? registro.timezones.join(', ') : '')
          registro.wikiEnUrl = `https://en.wikipedia.org/wiki/${registro.name}`;
          registro.wikiEsUrl = `https://es.wikipedia.org/wiki/${registro.translations.es}`;
          // registro.banderaUrl = `${URL_FLAGS}${registro.name.toString().replace(/ /g, URL_FLAGS_SEP).toLowerCase()}.${URL_FLAGS_EXT}`;
          registro.banderaUrl = `${URL_FLAGS}${registro.alpha3Code.toString().toLowerCase()}.${URL_FLAGS_EXT}`;
          registro.mapsPaisUrl = `${URL_MAPS}${registro.name}, country of ${registro.subregion}`;
          registro.mapsContinenteUrl = `${URL_MAPS}${registro.region}, continent`;
          registro.mapsRegionUrl = `${URL_MAPS}${registro.subregion}, region of ${registro.region}`;
          registro.mapsCapitalUrl = `${URL_MAPS}${registro.capital}, city of ${registro.name}`;
        })
        console.log(this._data[5]);
        this.setState({ numRegs: datos.length, estado: fetchStatus.Cargado });
      })
      .catch((err) => {
        // console.log(`Error en la vista: ${err}`);
        this.setState({ numRegs: 0, estado: fetchStatus.Error, mensaje: err });
      });
  }

  public componentDidMount() {
    if (this._getActiveMenuOption().loadCountries) {
      this._descargarPaises(this.state.origenDatos);
    } else {
      this.setState({ estado: fetchStatus.Cargado, });
    }
  }

  private _onChangeComboMenu = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({ activeMenuOptionId: item.key as menuOptionsId });
  };

  private _onChangeComboOrigenDatos = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`Cambiado origen de datos a ${item.key} (${item.text})`)
    this.setState({ estado: fetchStatus.Cargando });
    this._descargarPaises(item.key as origenesDatos);
  };

  public render(): JSX.Element {
    console.log('RENDER:', 'this.state.estado', this.state.estado, 'this.state.activeMenuOptionId', this.state.activeMenuOptionId, 'this.state.origenDatos', this.state.origenDatos);
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
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5px', alignSelf: 'center', backgroundColor: 'rgba(150, 150, 150,.5)', width: '100%' }}>
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
              {this._getActiveMenuOption().loadCountries ?
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px', alignSelf: 'center', width: '100%' }}>
                  <Label style={{ padding: '5px', paddingTop: '10px' }}> Selecciona un Origen de Datos: </Label>
                  <Dropdown
                    options={optionsComboDB}
                    selectedKey={this.state.origenDatos}
                    styles={{ dropdown: { width: 300, padding: '5px' } }}
                    onChange={this._onChangeComboOrigenDatos}
                  />
                </div>
                :
                null
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
              <SimpleListUIFabric
                hidden={!this._isMenuActive(menuOptionsId.FabricList)}
                datos={this._data}
                titulo={`Lista de UIFabric: se han encontrado ${this._data.length} Paises`}
                columns={COLUMNS_DEF}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

