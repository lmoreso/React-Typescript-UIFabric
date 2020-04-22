import * as React from 'react';

// Aplicattion imports
import { ISimpleListCol } from '../lib/SimpleListUIfabric/ISimpleListLib';
import { SimpleListHtml } from 'src/lib/SimpleListUIfabric/SimpleListHtml';
import { initStrings, strings, detectLanguage, languagesSupported, stringToLanguagesSupported, languagesSupportedIds, } from './loc/RestCountriesStrings';
import imgConfig from './recursos/config.svg';
import imgSpinner from './recursos/oval.svg';
import { ChangeEvent } from 'react';


const URL_COUNTRIES = 'http://restcountries.eu/rest/v1/all';
const URL_FLAGS = 'https://restcountries.eu/data/';
const URL_RESTCOUNTRIES_SITE = 'https://restcountries.eu/';

const URL_FLAGS_EXT = 'svg';
const JSON_DATA = require('./recursos/countries.json');

const URL_MAPS = 'https://maps.google.com/?q=';
const URL_WIKIPEDIA_EN = 'https://en.wikipedia.org/wiki'
const URL_WIKIPEDIA_ES = 'https://es.wikipedia.org/wiki'

const DEFAULT_HEIGHT = 600;
const DEFAULT_WIDTH = 1100;


enum dataSources { fromURL, fromJson, fromJsonWithDelay };
enum fetchResults { loading, loadedOk, loadedErr }

const DATA_SOURCE_DEF = dataSources.fromJsonWithDelay;

const COLOR_TITLE_AND_TABLE_HEADER = 'DARKSLATEBLUE';

function getRestCountriesColumns(): ISimpleListCol[] {
  return (
    [
      // { titulo: "Key", campo: "key", width: 10 },
      // { titulo: "Bandera", campo: "flag", width: 10, isImage: true },
      { title: strings.field_Flag, field: "banderaUrl", width: 35, isImage: true },
      { title: strings.field_NativeName, field: "nativeName", width: 150, fieldUrl: "mapsPaisUrl", canSortAndFilter: true, headerTooltip: "Clica para ir a 'Google Maps'" },
      { title: strings.field_EnglishName, field: "name", width: 150, fieldUrl: "wikiEnUrl", canSortAndFilter: true, headerTooltip: "Clica para ir a la 'Wikipedia' en Inglés" },
      { title: strings.field_SpanishName, field: "Pais", width: 150, fieldUrl: "wikiEsUrl", canSortAndFilter: true, headerTooltip: "Clica para ir a la 'Wikipedia' en Español"  },
      { title: strings.field_Capital, field: "capital", width: 120, fieldUrl: "mapsCapitalUrl", canSortAndFilter: true, headerTooltip: "Clica para ir a 'Google Maps'" },
      { title: strings.field_Continente, field: "region", width: 100, fieldUrl: "mapsContinenteUrl", canSortAndFilter: true, canGroup: true, headerTooltip: "Clica para ir a 'Google Maps'" },
      { title: strings.field_Region, field: "subregion", width: 100, fieldUrl: "mapsRegionUrl", canSortAndFilter: true, canGroup: true, headerTooltip: "Clica para ir a 'Google Maps'" },
      { title: strings.field_Siglas, field: "alpha3Code", width: 50, fieldUrl: "banderaUrl", canSortAndFilter: true, headerTooltip: "Clica para ver la Bandera" },
      { title: strings.field_Idiomas, field: "idiomas", width: 100, canSortAndFilter: false },
      { title: strings.field_NumHusos, field: "numHusos", width: 50, fieldTooltip: 'husosTooltip', canSortAndFilter: true, isNumeric: true, headerTooltip: "Mantén quieto el ratón para ver los Husos Horarios" },
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
  height?: number;
  width?: number;
};

async function DownloadCountries(dataSource: dataSources): Promise<any> {
  switch (dataSource) {
    case dataSources.fromJsonWithDelay:
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve(JSON_DATA);
        }, 800);
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

export class RestCountriesHTML extends React.Component<IRestCountriesExampleProps, IRestCountriesExampleStates> {
  private _data: any[];
  private _simpleListColumns: ISimpleListCol[];
  private _simpleListRef = React.createRef<SimpleListHtml>();

  private _loadStrings(languageProposed: languagesSupportedIds | undefined) : languagesSupportedIds {
    let languageDetected = detectLanguage(languageProposed);
    initStrings(languageDetected);
    return(languageDetected);
  }

  private _loadColumns(ignoreFlag: boolean): ISimpleListCol[] {
    // Copiar columnas y calcular su key
    this._simpleListColumns = new Array<ISimpleListCol>();
    getRestCountriesColumns().forEach((theColumn: ISimpleListCol, indice) => {
      if (!ignoreFlag || theColumn.field != 'banderaUrl') {
        let aCol = { ...theColumn };
        aCol.key = indice.toString();
        this._simpleListColumns.push(aCol);
        }
    });

    return(this._simpleListColumns);
  }

  public constructor(props: IRestCountriesExampleProps) {
    super(props);

    // Inicializar estados
    this.state = {
      numRegs: 0,
      fetchResult: fetchResults.loading,
      fetchResultMessage: '',
      dataSource: DATA_SOURCE_DEF,
      hiddenConfig: false,
      isCompactMode: true,
      language: this._loadStrings(stringToLanguagesSupported(this.props.language)),
    }
    // inicializar columnas para SimpeListHtml
    this._loadColumns(this.state.dataSource != dataSources.fromURL);

    // Binds de funciones
    this._renderTitle = this._renderTitle.bind(this);
    this._onClickButtonConfig = this._onClickButtonConfig.bind(this);
    this._onChangeCheckBoxCompactMode = this._onChangeCheckBoxCompactMode.bind(this);
    this._onChangeComboIdiomas = this._onChangeComboIdiomas.bind(this);
    this._onChangeCheckBoxIsUrl = this._onChangeCheckBoxIsUrl.bind(this);
  }

  private _onChangeCheckBoxIsUrl(event: React.ChangeEvent<HTMLInputElement>): void {
    let checked: boolean = event.target.checked; 
    let dataSource = (checked) ? dataSources.fromURL : dataSources.fromJsonWithDelay;
    this._loadColumns(dataSource != dataSources.fromURL);
    this._downloadCountries(dataSource);
  }

  private _onChangeComboIdiomas(event: ChangeEvent<HTMLSelectElement>): void {
    let newlanguage = stringToLanguagesSupported(event.target.value);
    if (newlanguage) {
      this._piensaUnTiempo(0.5);
      this._loadStrings(newlanguage);
      this._loadColumns(this.state.dataSource != dataSources.fromURL);
      this.setState({ language: newlanguage });
      // if (this._simpleListRef.current)
      //   this._simpleListRef.current.setLanguage(newlanguage);
    }
  }

  private _piensaUnTiempo (segundos: number) : void {
    this.setState({ fetchResult: fetchResults.loading });
    setTimeout(()=>this.setState({ fetchResult: fetchResults.loadedOk }), segundos * 1000);
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
      borderWidth: '1px', width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    };

    let cssConfigBody: React.CSSProperties = {
      margin: '2px 2px 2px 2px',
      verticalAlign: 'baseline',
    }

    let cssTitleHeader: React.CSSProperties = {
      fontSize: 'large', display: 'flex', justifyContent: 'flex-end', padding: '4px', alignSelf: 'center', color: 'white',
      backgroundColor: COLOR_TITLE_AND_TABLE_HEADER, width: '100%', borderStyle: 'solid', borderColor: COLOR_TITLE_AND_TABLE_HEADER,
      borderWidth: '1px',
    }

    return (
      <div style={{width: this.props.width || DEFAULT_WIDTH}}>
        <div style={cssTitleHeader}>
          <div style={{ verticalAlign: 'middle', width: '100%' }} >
            {strings.title_App}
            <small>
              {` (${strings.agradecimiento} `}
              <a target='_blank' style={{ color: 'white' }} href={URL_RESTCOUNTRIES_SITE}>{URL_RESTCOUNTRIES_SITE}</a>{')'}
            </small>
          </div>
          <span style={{ verticalAlign: 'middle', width: '30px' , }}>
            <img onClick={this._onClickButtonConfig}
              src={imgConfig}
              title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
              style={{ cursor: 'pointer' }}
            />
          </span>
        </div>
        {/* Configuración */}
        {(this.state.hiddenConfig ? null :
          <div style={cssConfigHeader}>
            {/* Checkbox isCompactMode */}
            <label style={cssConfigBody}>
              {strings.config_CompactMode}
              <input style={{ marginLeft: '2px' }}
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

            {/* Checkbox dataSource */}
            <label style={cssConfigBody}>
              {'Descargar Banderas de restCountries.eu'}
              <input style={{ textAlign: 'center', marginLeft: '2px' }}
                name="ToggleIsUrl"
                type="checkbox"
                checked={this.state.dataSource == dataSources.fromURL}
                onChange={this._onChangeCheckBoxIsUrl}
              />
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
        <div style={{width: this.props.width || DEFAULT_WIDTH}}>
          <this._renderTitle />
          <p> {strings.model_Loading}</p>
          <img 
              src={imgSpinner}
              title={strings.model_Loading}
              style={{ color: COLOR_TITLE_AND_TABLE_HEADER }}
            />
        </div>
      );
    } else if (this.state.fetchResult == fetchResults.loadedErr) {
      return (
        <div style={{width: this.props.width || DEFAULT_WIDTH}}>
          <this._renderTitle />
          <h1>Se ha producido un error:</h1>
          <p>{this.state.fetchResultMessage}</p>
        </div>
      );
    } else {
      return (
        <div style={{width: this.props.width || DEFAULT_WIDTH}}>
          <this._renderTitle />
          <SimpleListHtml
            ref={this._simpleListRef}
            hidden={false}
            data={this._data}
            labelItem={strings.label_Pais}
            labelItems={strings.label_Paises}
            columns={this._simpleListColumns}
            isCompactMode={this.state.isCompactMode}
            showToggleCompactMode={false}
            showLabel={false}
            heightInPx={this.props.height || DEFAULT_HEIGHT}
            language={this.state.language}
            backgroundColorHeader={COLOR_TITLE_AND_TABLE_HEADER}
          />
        </div>
      )
    } 
  }
}


