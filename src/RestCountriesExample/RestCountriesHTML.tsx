import * as React from 'react';

// Aplicattion imports
import { ISimpleListCol } from '../lib/SimpleList/ISimpleListLib';
import { SimpleListHtml, simpleListVersionLabel } from 'src/lib/SimpleList/SimpleListHtml';
import { initStrings, strings, detectLanguage, languagesSupported, stringToLanguagesSupported, languagesSupportedIds, } from './loc/RestCountriesStrings';
import { ChangeEvent } from 'react';
import { IconoConfig, IconoSpinner, IconoInfo, IconoCerrar, IconoGithub, IconoLinkedIn } from './recursos/svgs';
import { themeRed, themeGreen, themeBlue, themeCyan, themeYellow, themeMagenta, themeGray, ISlStyles } from 'src/lib/SimpleList/SimpleListHtmlStyles';

const restCountriesVersion = '0.1.2';
const restCountriesVersionLabel = `RestCountries V.${restCountriesVersion}`;

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

function getRestCountriesColumns(): ISimpleListCol[] {
  return (
    [
      // { titulo: "Key", campo: "key", width: 10 },
      // { titulo: "Bandera", campo: "flag", width: 10, isImage: true },
      { title: strings.field_Flag, field: "banderaUrl", width: 35, isImage: true },
      {
        title: strings.field_NativeName, field: "nativeName", width: 150, fieldUrl: "mapsPaisUrl", canSortAndFilter: true,
        headerTooltip: strings.click_ToSeeCountryInGoogleMaps,
      },
      {
        title: strings.field_EnglishName, field: "name", width: 150, fieldUrl: "wikiEnUrl", canSortAndFilter: true,
        headerTooltip: strings.click_ToGoWikipediaInEnglish,
      },
      {
        title: strings.field_SpanishName, field: "Pais", width: 150, fieldUrl: "wikiEsUrl", canSortAndFilter: true,
        headerTooltip: strings.click_ToGoWikipediaInSpanish
      },
      {
        title: strings.field_Capital, field: "capital", width: 120, fieldUrl: "mapsCapitalUrl", canSortAndFilter: true,
        headerTooltip: strings.click_ToSeeCapitalInGoogleMaps,
      },
      {
        title: strings.field_Continente, field: "region", width: 100, fieldUrl: "mapsContinenteUrl", canSortAndFilter: true, canGroup: true,
        headerTooltip: strings.click_ToSeeContinentInGoogleMaps,
      },
      {
        title: strings.field_Region, field: "subregion", width: 100, fieldUrl: "mapsRegionUrl", canSortAndFilter: true, canGroup: true,
        headerTooltip: strings.click_ToSeeregionInGoogleMaps,
      },
      {
        title: strings.field_Siglas, field: "alpha3Code", width: 50, fieldUrl: "banderaUrl", canSortAndFilter: true,
        headerTooltip: strings.click_ToSeeFlag
      },
      { title: strings.field_Idiomas, field: "idiomas", width: 100, canSortAndFilter: false },
      {
        title: strings.field_NumHusos, field: "numHusos", width: 50, fieldTooltip: 'husosTooltip', canSortAndFilter: true, isNumeric: true,
        headerTooltip: strings.click_ToViewTimeZones
      },
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
  theme: IRCTheme;
  hiddenInfo: boolean;
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

interface IRCTheme {
  key: string;
  slStyle: ISlStyles;
  name: string;
}

export class RestCountriesHTML extends React.Component<IRestCountriesExampleProps, IRestCountriesExampleStates> {
  private _data: any[];
  private _simpleListColumns: ISimpleListCol[];
  private _simpleListRef = React.createRef<SimpleListHtml>();
  private _themes: IRCTheme[];
  private _defaultThemeKey = 3 // themeGray

  public constructor(props: IRestCountriesExampleProps) {
    super(props);

    // Cargar traducciones
    let language = this._loadStrings(stringToLanguagesSupported(this.props.language));

    // Inicializar estados
    this.state = {
      numRegs: 0,
      fetchResult: fetchResults.loading,
      fetchResultMessage: '',
      dataSource: DATA_SOURCE_DEF,
      hiddenConfig: true,
      hiddenInfo: true,
      isCompactMode: false,
      language: language,
      theme: this._themes[this._defaultThemeKey],
    }

    // inicializar columnas para SimpeListHtml
    this._loadColumns(this.state.dataSource != dataSources.fromURL);

    // Binds de funciones
    this._renderTitle = this._renderTitle.bind(this);
    this._onClickButtonConfig = this._onClickButtonConfig.bind(this);
    this._onClickButtonInfo = this._onClickButtonInfo.bind(this);
    this._onChangeCheckBoxCompactMode = this._onChangeCheckBoxCompactMode.bind(this);
    this._onChangeComboIdiomas = this._onChangeComboIdiomas.bind(this);
    this._onChangeCheckBoxIsUrl = this._onChangeCheckBoxIsUrl.bind(this);
    this._onChangeComboColores = this._onChangeComboColores.bind(this);
  }

  private _initColors() {
    this._themes = new Array<{
      key: string;
      slStyle: ISlStyles;
      name: string;
    }>();
    this._themes.push({ key: "themeCyan", slStyle: themeCyan, name: strings.color_Cyan });
    this._themes.push({ key: "themeMagenta", slStyle: themeMagenta, name: strings.color_Magenta });
    this._themes.push({ key: "themeYellow", slStyle: themeYellow, name: strings.color_Yellow });
    this._themes.push({ key: "themeGray", slStyle: themeGray, name: strings.color_Grays });
    this._themes.push({ key: "themeRed", slStyle: themeRed, name: strings.color_Red });
    this._themes.push({ key: "themeGreen", slStyle: themeGreen, name: strings.color_Green });
    this._themes.push({ key: "themeBlue", slStyle: themeBlue, name: strings.color_Blue });
  }

  private _loadStrings(languageProposed: languagesSupportedIds | undefined): languagesSupportedIds {
    let languageDetected = detectLanguage(languageProposed);
    initStrings(languageDetected);

    // Inicializar lista de Colores
    this._initColors();

    return (languageDetected);
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

    return (this._simpleListColumns);
  }

  private _onChangeComboColores(event: ChangeEvent<HTMLSelectElement>): void {
    this._piensaUnTiempo(0.1);
    this.setState({ theme: this._getTheme(event.target.value) });
  }

  private _getTheme(themeKey: string): IRCTheme {
    return (this._themes.find((aTheme) => (aTheme.key == themeKey)) || this._themes[this._defaultThemeKey]);
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

  private _piensaUnTiempo(segundos: number): void {
    this.setState({ fetchResult: fetchResults.loading });
    setTimeout(() => this.setState({ fetchResult: fetchResults.loadedOk }), segundos * 1000);
  }

  private _onClickButtonConfig(event: any): void {
    this.setState({ hiddenConfig: !this.state.hiddenConfig });
  }

  private _onClickButtonInfo(event: any): void {
    this.setState({ hiddenInfo: !this.state.hiddenInfo });
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

  private _renderTitle(styleHeader: React.CSSProperties): JSX.Element {
    let cssConfigBody: React.CSSProperties = {
      margin: '2px 2px 2px 2px',
      verticalAlign: 'baseline',
    }

    let cssTitleContainer: React.CSSProperties = {
      fontSize: 'large',
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      paddingTop: '2px',
      width: '100%',
      height: '40px',
      borderStyle: 'solid',
      borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '1px',
      color: this.state.theme.slStyle.tableContainerBackgroundColor,
      backgroundColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
    }

    let cssInfoContainer: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      paddingTop: '2px',
      width: '100%',
      height: '40px',
      borderStyle: 'solid',
      borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '1px',
      backgroundColor: this.state.theme.slStyle.tableContainerBackgroundColor,
    }

    let cssConfigContainer: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      paddingTop: '2px',
      width: '100%',
      height: '40px',
      borderStyle: 'solid',
      borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '1px',
      backgroundColor: this.state.theme.slStyle.tableContainerBackgroundColor,
    };


    return (
      <div style={{
        width: this.props.width || DEFAULT_WIDTH,
        // borderStyle: 'solid',
        // borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
        // borderWidth: '1px',
      }}>
        {/* Barra de Título */}
        <div style={cssTitleContainer}>
          {/* Icono INFO */}
          <span
            style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
            onClick={this._onClickButtonInfo}
            title={(this.state.hiddenInfo) ? strings.header_ShowInfo : strings.header_HideInfo}
          >
            <IconoInfo fill={this.state.theme.slStyle.tableContainerBackgroundColor} />
          </span>
          {/* Título */}
          <div style={{ verticalAlign: 'middle', width: '100%' }} >
            {strings.title_App}
            <small>
              {` (${strings.agradecimiento} `}
              <a target='_blank'
                style={{ color: this.state.theme.slStyle.tableContainerBackgroundColor }}
                href={URL_RESTCOUNTRIES_SITE}>{URL_RESTCOUNTRIES_SITE}
              </a>{')'}
            </small>
          </div>
          {/* Icono Configuración */}
          <span
            style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer', margin: '2px', }}
            onClick={this._onClickButtonConfig}
            title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
          >
            <IconoConfig fill={this.state.theme.slStyle.tableContainerBackgroundColor} />
          </span>
        </div>

        {/* Créditos */}
        {(this.state.hiddenInfo) ? null :
          <div style={cssInfoContainer}>
            {/* Icono Info */}
            <span
              style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
              onClick={this._onClickButtonInfo}
              title={(this.state.hiddenInfo) ? strings.header_ShowInfo : strings.header_HideInfo}
            >
              <IconoInfo fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} />
            </span>
            {/* Contenido de los créditos */}
            <div style={{
              verticalAlign: 'middle',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              alignContent: 'center',
              alignItems: 'center',
            }} >
              <span style={{ verticalAlign: 'middle', fontSize: '0.8em', textAlign: 'left'}}>
                {simpleListVersionLabel}<br/>{restCountriesVersionLabel}
              </span>

              <span style={{ verticalAlign: 'middle' }}>
                ©2020 <a target="_blank" href="mailto:lmoreso@yahoo.com" title="Envía un e-mail al autor">Lluís Moreso Bosch</a>
              </span>
              {/* <span style={{ verticalAlign: 'middle' }}>
                <a target="_blank" href="https://es.linkedin.com/pub/lluis-moreso-bosch/3b/381/663">
                  <img src={`${process.env.PUBLIC_URL}img/btn_viewmy_linkedin_160x33_es_ES.png`} width="160"
                    title="Ver el perfil de Lluis Moreso Bosch en LinkedIn" />
                </a>
              </span> */}
              <span style={{ verticalAlign: 'middle' }}>
                <a
                  style={{ verticalAlign: 'middle', height: '100%', display: 'flex', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', }}
                  target="_blank" href="https://es.linkedin.com/pub/lluis-moreso-bosch/3b/381/663"
                  title="Visita mi perfil en LinkedIn"
                >
                  {/* <img src="img/Github.png" width="35px"
                    title="Clona la App en GitHub" /> */}
                  <IconoLinkedIn fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} />
                  <span> Visita mi perfil en LinkedIn</span>
                </a>
              </span>

              <span style={{ verticalAlign: 'middle' }}>
                <a
                  style={{ verticalAlign: 'middle', height: '100%', display: 'flex', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', }}
                  target="_blank" href="https://github.com/lmoreso/React-Typescript-UIFabric"
                  title="Clona la App en GitHub"
                >
                  {/* <img src="img/Github.png" width="35px"
                    title="Clona la App en GitHub" /> */}
                  <IconoGithub fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} />
                  <span> Clona la App en GitHub</span>
                </a>
              </span>
            </div>
            {/* Icono Cerrar */}
            <span
              style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
              onClick={this._onClickButtonInfo}
              title={(this.state.hiddenInfo) ? strings.header_ShowInfo : strings.header_HideInfo}
            >
              <IconoCerrar fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} />
            </span>
          </div>
        }
        {/* Configuración */}
        {(this.state.hiddenConfig) ? null :
          <div style={cssConfigContainer}>
            {/* Icono Configuración */}
            <span
              style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}

              onClick={this._onClickButtonConfig}
              title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
            >
              <IconoConfig fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} />
            </span>

            {/* Contenido de la configuración */}
            <div style={{
              verticalAlign: 'middle',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              alignContent: 'center',
              alignItems: 'center',
            }} >

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
                {strings.label_LoadFromRestcountries}
                <input style={{ textAlign: 'center', marginLeft: '2px' }}
                  name="ToggleIsUrl"
                  type="checkbox"
                  checked={this.state.dataSource == dataSources.fromURL}
                  onChange={this._onChangeCheckBoxIsUrl}
                />
              </label>

              {/* Combo colores */}
              <label style={cssConfigBody}>
                {strings.config_SelectColors}
                <select style={{ textAlign: 'center', marginLeft: '2px' }} value={(this.state.theme.key)} onChange={this._onChangeComboColores}>
                  {this._themes.map((aTheme, index) => {
                    return (
                      <option key={aTheme.key} value={aTheme.key}>
                        {`${aTheme.name}`}
                      </option>
                    )
                  })}
                </select>
              </label>
            </div>

            {/* Icono Cerrar */}
            <span
              style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
              onClick={this._onClickButtonConfig}
              title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
            >
              <IconoCerrar fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} />
            </span>
          </div>
        }
      </div>
    );
  }

  public render(): JSX.Element {
    // console.log('RestCountriesExample render', 'ver config?', this.state.hiddenConfig);
    let mainStyle = {
      width: this.props.width || DEFAULT_WIDTH,
      borderStyle: 'solid',
      borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '1px',
    }

    if (this.state.fetchResult == fetchResults.loading) {
      return (
        <div style={mainStyle}>
          <this._renderTitle />
          <p> {strings.model_Loading}</p>
          <IconoSpinner
            fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor}
          />
        </div>
      );
    } else if (this.state.fetchResult == fetchResults.loadedErr) {
      return (
        <div style={mainStyle}>
          <this._renderTitle />
          <h1>Se ha producido un error:</h1>
          <p>{this.state.fetchResultMessage}</p>
        </div>
      );
    } else {
      return (
        <div style={mainStyle}>
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
            theme={this.state.theme.slStyle}
          />
        </div>
      )
    }
  }
}


