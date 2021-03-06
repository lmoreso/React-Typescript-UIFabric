import * as React from 'react';
// Fluent UI imports
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IColumn, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ChangeEvent } from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

// Aplicattion imports
import { ISimpleListCol } from '../lib/SimpleList/ISimpleListLib';
import { SimpleListUIFabric } from '../lib/SimpleList/SimpleListUIFabric';
import { SimpleListHtml } from 'src/lib/SimpleList/SimpleListHtml';
// import { IDebugListConfig, DebugList, DebugListRenderTable, DebugListRenderTxt } from '../lib/SimpleListUIfabric/SimpleList';
import { initStrings, strings, detectLanguage, languagesSupported, stringToLanguagesSupported, languagesSupportedIds, } from './loc/RestCountriesStrings';
import { IconoConfig, } from './recursos/svgs';


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
  hiddenConfig: boolean;
  isCompactMode: boolean;
  language: string;
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

export class RestCountriesUIFabric extends React.Component<IRestCountriesExampleProps, IRestCountriesExampleStates> {
  private _data: any[];
  private _columnsUIFabric: IColumn[];
  private _simpleListColumns: ISimpleListCol[];
  private _simpleListRef = React.createRef<SimpleListHtml>();

  private _loadStrings(languageProposed: languagesSupportedIds | undefined): languagesSupportedIds {
    let languageDetected = detectLanguage(languageProposed);
    initStrings(languageDetected);
    return (languageDetected);
  }

  private _loadColumns(): ISimpleListCol[] {
    // Copiar columnas y calcular su key
    this._simpleListColumns = new Array<ISimpleListCol>();
    getRestCountriesColumns().forEach((theColumn: ISimpleListCol, indice) => {
      let aCol = { ...theColumn };
      aCol.key = indice.toString();
      this._simpleListColumns.push(aCol);
    })

    return (this._simpleListColumns);
  }

  public constructor(props: IRestCountriesExampleProps) {
    super(props);

    // Inicializar estados
    this.state = {
      numRegs: 0,
      fetchResult: fetchResults.loading,
      fetchResultMessage: '',
      dataSource: DATA_SOURCE_DEF,
      hiddenConfig: true,
      isCompactMode: true,
      language: this._loadStrings(stringToLanguagesSupported(this.props.language)),
    }
    // inicializar columnas para SimpeListHtml
    this._loadColumns();

    // Inicializar las columnas para el DetailList
    this._columnsUIFabric = new Array<IColumn>();
    this._simpleListColumns.forEach((aCountry: ISimpleListCol, indice) => {
      this._columnsUIFabric.push({
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

    // Binds de funciones
    this._renderTitle = this._renderTitle.bind(this);
    this._onClickButtonConfig = this._onClickButtonConfig.bind(this);
    this._onChangeCheckBoxCompactMode = this._onChangeCheckBoxCompactMode.bind(this);
    this._onChangeComboIdiomas = this._onChangeComboIdiomas.bind(this);
  }

  private _onChangeComboIdiomas(event: ChangeEvent<HTMLSelectElement>): void {
    let newlanguage = stringToLanguagesSupported(event.target.value);
    if (newlanguage) {
      this._piensaUnTiempo(0.5);
      this._loadStrings(newlanguage);
      this._loadColumns();
      this.setState({ language: newlanguage });
      // if (this._simpleListRef.current)
      //   this._simpleListRef.current.setLanguage(newlanguage);
    }
  }

  private _piensaUnTiempo(segundos: number): void {
    this.setState({ fetchResult: fetchResults.loading });
    setTimeout(() => this.setState({ fetchResult: fetchResults.loadedOk }), segundos * 1000);
  }

  private _onClickButtonConfig(event: any): void {
    // console.log('_onClickButtonConfig');
    this.setState({ hiddenConfig: !this.state.hiddenConfig });
  }

  private _onChangeCheckBoxCompactMode(event: React.ChangeEvent<HTMLInputElement>): void {
    let checked: boolean = !this.state.isCompactMode;  // event.target.checked
    this.setState({ isCompactMode: checked, });
    this._simpleListRef.current!.setState({ isCompactMode: checked, });
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
        // console.log(this._data[5]);
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
    let cssConfigHeader: React.CSSProperties = {
      verticalAlign: 'middle',
      padding: '4px',
      height: '40px',
      borderStyle: 'solid',
      borderColor: COLOR_TITLE_AND_TABLE_HEADER,
      borderWidth: '2px', width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    };

    let cssConfigBody: React.CSSProperties = {
      margin: '2px 2px 2px 2px',
      verticalAlign: 'middle',
    }

    let cssTitleHeader: React.CSSProperties = {
      fontSize: 'large', display: 'flex', justifyContent: 'flex-end', padding: '4px', alignSelf: 'center', color: 'white',
      backgroundColor: COLOR_TITLE_AND_TABLE_HEADER, width: '100%', borderStyle: 'solid', borderColor: COLOR_TITLE_AND_TABLE_HEADER,
      borderWidth: '2px',
    }

    return (
      <div>
        <div style={cssTitleHeader}>
          <div style={{ verticalAlign: 'middle', width: '100%' }} >
            {strings.title_App}
            <small>
              {` (${strings.agradecimiento} `}
              <a target='_blank' style={{ color: 'white' }} href={URL_RESTCOUNTRIES_SITE}>{URL_RESTCOUNTRIES_SITE}</a>{')'}
            </small>
          </div>
          <span 
            style={{ verticalAlign: 'middle', width: '30px', cursor: 'pointer', }}
            title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
            onClick={this._onClickButtonConfig}
          >
            <IconoConfig fill={'white'} />
          </span>
        </div>
        {/* Configuración */}
        {(this.state.hiddenConfig ? null :
          <div style={cssConfigHeader}>
            {/* Checkbox isCompactMode */}
            <label style={cssConfigBody}>
              {strings.config_CompactMode}
              <input
                name="ToggleCompactMode"
                type="checkbox"
                checked={this.state.isCompactMode}
                onChange={this._onChangeCheckBoxCompactMode}
              />
            </label>

            {/* Combo idiomas */}
            <label style={cssConfigBody}>
              {strings.config_SelectLanguage}
              <select style={{ textAlign: 'center', marginLeft: '2px' }} value={this.state.language} onChange={this._onChangeComboIdiomas}>
                {languagesSupported.map((aLanguage, index) => {
                  return (
                    <option key={index} value={aLanguage.id}>
                      {`${aLanguage.title}`}
                    </option>
                  )
                })}
              </select>

            </label>

          </div>
        )}
      </div>
    );
  }

  public render(): JSX.Element {
    // console.log('RestCountriesExample render', 'ver config?', this.state.hiddenConfig);
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


