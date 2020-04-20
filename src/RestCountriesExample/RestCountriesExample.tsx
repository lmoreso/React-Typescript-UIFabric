import * as React from 'react';
// Fluent UI imports
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IColumn, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';

// Aplicattion imports
import { ISimpleListCol } from '../lib/SimpleListUIfabric/ISimpleListLib';
import { SimpleListUIFabric } from '../lib/SimpleListUIfabric/SimpleListUIFabric';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { SimpleListHtml } from 'src/lib/SimpleListUIfabric/SimpleListHtml';
// import { IDebugListConfig, DebugList, DebugListRenderTable, DebugListRenderTxt } from '../lib/SimpleListUIfabric/SimpleList';
import { initStrings, strings, detectLanguage, } from './loc/RestCountriesStrings';
import imgConfig from './recursos/config.svg';


const URL_COUNTRIES = 'http://restcountries.eu/rest/v1/all';
const URL_FLAGS = 'https://restcountries.eu/data/';
const URL_RESTCOUNTRIES_SITE = 'https://restcountries.eu/';

const URL_FLAGS_EXT = 'svg';
const JSON_DATA = require('./recursos/countries.json');

const URL_MAPS = 'https://maps.google.com/?q=';
const URL_WIKIPEDIA_EN = 'https://en.wikipedia.org/wiki'
const URL_WIKIPEDIA_ES = 'https://es.wikipedia.org/wiki'

enum dataSources { fromURL, fromJson, fromJsonWithDelay };
enum fetchResults { loading, loadedOk, loadedErr }

const DATA_SOURCE_DEF = dataSources.fromURL;

const COLOR_TITLE_AND_TABLE_HEADER = 'DARKSLATEBLUE';

function getRestCountriesColumns(): ISimpleListCol[] {
  return (
    [
      // { titulo: "Key", campo: "key", width: 10 },
      // { titulo: "Bandera", campo: "flag", width: 10, isImage: true },
      { title: strings.field_Flag, field: "banderaUrl", width: 35, isImage: true },
      { title: strings.field_NativeName, field: "nativeName", width: 150, fieldUrl: "mapsPaisUrl", canSortAndFilter: true },
      { title: strings.field_EnglishName, field: "name", width: 150, fieldUrl: "wikiEnUrl", canSortAndFilter: true },
      { title: strings.field_SpanishName, field: "Pais", width: 150, fieldUrl: "wikiEsUrl", canSortAndFilter: true },
      { title: strings.field_Capital, field: "capital", width: 120, fieldUrl: "mapsCapitalUrl", canSortAndFilter: true },
      { title: strings.field_Continente, field: "region", width: 100, fieldUrl: "mapsContinenteUrl", canSortAndFilter: true, canGroup: true },
      { title: strings.field_Region, field: "subregion", width: 100, fieldUrl: "mapsRegionUrl", canSortAndFilter: true, canGroup: true },
      { title: strings.field_Siglas, field: "alpha3Code", width: 50, fieldUrl: "banderaUrl", canSortAndFilter: true },
      { title: strings.field_Idiomas, field: "idiomas", width: 100, canSortAndFilter: false },
      { title: strings.field_NumHusos, field: "numHusos", width: 50, fieldTooltip: 'husosTooltip', canSortAndFilter: true, isNumeric: true },
    ]
  )
}

interface IRestCountriesExampleStates {
  numRegs: number;
  fetchResult: fetchResults;
  fetchResultMessage: string;
  dataSource: dataSources;
}

export interface IRestCountriesExampleProps {
  language?: string;
  showAsHtmlTable?: boolean;
};

async function DownloadCountries(dataSource: dataSources): Promise<any> {
  switch (dataSource) {
    case dataSources.fromJsonWithDelay:
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve(JSON_DATA);
        }, 2000);
      })
    case dataSources.fromJson:
      return new Promise((resolve) => { resolve(JSON_DATA); })
    case dataSources.fromURL:
      return new Promise((resolve, reject) => {
        fetch(URL_COUNTRIES)
          .then(res => {
            if (res) {
              resolve(res.json());
            } else {
              reject(`La url ${URL_COUNTRIES}, no ha devuelto nada.`);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    default:
      throw "El Origen de Datos no es válido";
  }
}

export class RestCountriesExample extends React.Component<IRestCountriesExampleProps, IRestCountriesExampleStates> {
  private _data: any[];
  private _columns: IColumn[];

  public constructor(props: IRestCountriesExampleProps) {
    super(props);

    // cargar traducciones
    initStrings(detectLanguage(this.props.language));

    // Inicializar estados
    this.state = { numRegs: 0, fetchResult: fetchResults.loading, fetchResultMessage: '', dataSource: DATA_SOURCE_DEF }

    // Inicializar las columnas para el DetailList
    this._columns = new Array<IColumn>();
    getRestCountriesColumns().forEach((aCountry: ISimpleListCol, indice) => {
      this._columns.push({
        key: indice.toString(),
        name: aCountry.title,
        fieldName: aCountry.field,
        minWidth: aCountry.width * 3,
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

  }

  private _downloadCountries(dataSource: dataSources) {
    this.setState({ fetchResult: fetchResults.loading, dataSource: dataSource });
    // DescargarPaises(origenesDatos.ninguno)
    DownloadCountries(dataSource)
      .then((datos) => {
        this._data = datos;
        this._data.forEach((registro, indice) => {
          registro.key = indice.toString();
          registro.Pais = registro.translations.es;
          registro.numHusos = registro.timezones.length;
          registro.idiomas = (Array.isArray(registro.languages)) ? registro.languages.join(', ') : registro.languages;
          registro.husosTooltip = (Array.isArray(registro.timezones) ? registro.timezones.join(', ') : '');
          registro.wikiEnUrl = `${URL_WIKIPEDIA_EN}/${registro.name}`;
          registro.wikiEsUrl = `${URL_WIKIPEDIA_ES}/${registro.translations.es}`;
          registro.banderaUrl = `${URL_FLAGS}${registro.alpha3Code.toString().toLowerCase()}.${URL_FLAGS_EXT}`;
          registro.mapsPaisUrl = `${URL_MAPS}${registro.name}, country of ${registro.subregion}`;
          registro.mapsContinenteUrl = `${URL_MAPS}${registro.region}, continent`;
          registro.mapsRegionUrl = `${URL_MAPS}${registro.subregion}, region of ${registro.region}`;
          registro.mapsCapitalUrl = `${URL_MAPS}${registro.capital}, city of ${registro.name}`;
        })
        console.log(this._data[5]);
        this.setState({ numRegs: datos.length, fetchResult: fetchResults.loadedOk });
      })
      .catch((err) => {
        this.setState({ numRegs: 0, fetchResult: fetchResults.loadedErr, fetchResultMessage: err });
      });
  }

  public componentDidMount() {
    this._downloadCountries(this.state.dataSource);
  }

  private _renderTitle(): JSX.Element {
    return (
      <div style={{
        fontSize: 'large', display: 'flex', justifyContent: 'flex-end', padding: '4px', alignSelf: 'center', color: 'white',
        backgroundColor: COLOR_TITLE_AND_TABLE_HEADER, width: '100%', 
      }}>
        <div style={{ alignSelf: 'left', verticalAlign: 'middle', width: '100%'}} >
          {strings.title_App}
          <small>
            {` (${strings.agradecimiento} `}
            <a target='_blank' style={{ color: 'white'}} href={URL_RESTCOUNTRIES_SITE}>{URL_RESTCOUNTRIES_SITE}</a>{')'}
          </small>
        </div>
        <span style={{ verticalAlign: 'middle', width: '30px'}}>
          <img /* height='30' */  src={imgConfig} title='Configuración ...'/>
        </span>
      </div>
    );
  }

  public render(): JSX.Element {
    // console.log('RestCountriesExample render');
    if (this.state.fetchResult == fetchResults.loading) {
      return (
        <div>
          <this._renderTitle />
          <Label> {strings.model_Loading}</Label>
          <Spinner size={SpinnerSize.large} />
        </div>
      );
    } else if (this.state.fetchResult == fetchResults.loadedErr) {
      return (
        <div>
          <this._renderTitle />
          <h1>Se ha producido un error:</h1>
          <p>{this.state.fetchResultMessage}</p>
        </div>
      );
    } else if (this.props.showAsHtmlTable) {
      return (
        <div>
          <this._renderTitle />
          <SimpleListHtml
            hidden={false}
            data={this._data}
            labelItem={strings.label_Pais}
            labelItems={strings.label_Paises}
            columns={getRestCountriesColumns()}
            listCompactMode={false}
            showToggleCompactMode={false}
            showLabel={false}
            heightInPx={600}
            language={this.props.language}
            backgroundColorHeader={COLOR_TITLE_AND_TABLE_HEADER}
          />
        </div>
      )
    } else {
      return (
        <div>
          <this._renderTitle />
          <SimpleListUIFabric
            hidden={false}
            data={this._data}
            labelItem='Pais'
            labelItems='Paises'
            columns={getRestCountriesColumns()}
            fieldsTextFilter={['Paises', 'name', 'nativeName']}
            fieldDropdownFilter={{ valueIfNull: 'Without Continent', field: 'region', valueNoFilter: 'Todos los Continentes' }}
            listCompactMode={true}
            showToggleCompactMode={false}
            fixedHeader={false}
            showLabel={false}
          />
        </div>
      );
    }
  }
}


