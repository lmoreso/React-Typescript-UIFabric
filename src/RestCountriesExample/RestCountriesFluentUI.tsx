import * as React from 'react';
import { ChangeEvent } from 'react';

// Aplicattion imports
import * as mod from './RestCountriesCommon';
import { ISimpleListCol } from '../lib/SimpleList/ISimpleListLib';
import { SimpleListFluentUI, simpleListFluentUIVersionLabel } from 'src/lib/SimpleList/SimpleListFluentUI';
import { initStrings, strings, detectLanguage, languagesSupported, stringToLanguagesSupported, languagesSupportedIds, ILanguagesSupported, }
  from './loc/RestCountriesStrings';
import { IconoGithub, } from './recursos/iconos';
import { themeRed, themeGreen, themeBlue, themeCyan, themeYellow, themeMagenta, themeGray, ISlStyles }
  from 'src/lib/SimpleList/SimpleListColors';
// FluentUI imports
// import { Callout } from 'office-ui-fabric-react/lib/Callout';
// import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
// import { mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Image } from 'office-ui-fabric-react/lib/Image';

const restCountriesFluentUIVersion = '0.0.1';
const restCountriesFluentUIVersionLabel = `RestCountriesFluentUI V.${restCountriesFluentUIVersion}`;

export class RestCountriesFluentUI extends React.Component<mod.IRestCountriesProps, mod.IRestCountriesStates> {
  private _data: any[];
  private _simpleListColumns: ISimpleListCol[];
  private _simpleListRef = React.createRef<SimpleListFluentUI>();
  private _themes: mod.IRCTheme[];
  private _defaultThemeKey = 3 // themeGray
  private _comboIdiomas: IDropdownOption[];
  private _comboColores: IDropdownOption[];

  public constructor(props: mod.IRestCountriesProps) {
    super(props);

    // Cargar traducciones
    // let language = this._loadStrings(stringToLanguagesSupported(this.props.language));
    let language = this._loadStrings();

    /* Combo de Idiomas*/
    this._comboIdiomas = new Array<IDropdownOption>();
    languagesSupported.forEach((anLang: ILanguagesSupported, index) => {
      this._comboIdiomas.push({ key: anLang.id, text: anLang.title });
    });

    /* Combo de Colores*/
    this._comboColores = new Array<IDropdownOption>();
    this._themes.forEach((anColor: mod.IRCTheme, index) => {
      this._comboColores.push({ key: anColor.key, text: anColor.name });
    });

    // Inicializar estados
    this.state = {
      numRegs: 0,
      fetchResult: mod.fetchResults.loading,
      fetchResultMessage: '',
      dataSource: mod.DATA_SOURCE_DEF,
      hiddenConfig: true,
      hiddenInfo: true,
      isCompactMode: false,
      language: language,
      theme: this._themes[this._defaultThemeKey],
      hiddenLabel: true,
      showFilter: true,
    }

    // inicializar columnas para SimpeListHtml
    this._loadColumns(this.state.dataSource != mod.dataSources.fromURL);

    // Binds de funciones
    this._renderHeader = this._renderHeader.bind(this);
    this._renderTitleBar = this._renderTitleBar.bind(this);
    this._renderInfo = this._renderInfo.bind(this);
    this._renderConfig = this._renderConfig.bind(this);
    this._onClickButtonConfig = this._onClickButtonConfig.bind(this);
    this._onClickButtonInfo = this._onClickButtonInfo.bind(this);
    this._onChangeCheckBoxCompactMode = this._onChangeCheckBoxCompactMode.bind(this);
    this._onChangeComboColores = this._onChangeComboColores.bind(this);
    this._onChangeCheckBoxShowFilter = this._onChangeCheckBoxShowFilter.bind(this);

  }

  public componentDidMount() {
    this._downloadCountries(this.state.dataSource);
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

  private _loadStrings(languageProposed?: languagesSupportedIds): languagesSupportedIds {
    let languageDetected = detectLanguage(languageProposed);
    initStrings(languageDetected);

    // Inicializar lista de Colores
    this._initColors();

    return (languageDetected);
  }

  private _loadColumns(ignoreFlag: boolean): ISimpleListCol[] {
    // Copiar columnas y calcular su key
    this._simpleListColumns = new Array<ISimpleListCol>();
    mod.getRestCountriesColumns().forEach((theColumn: ISimpleListCol, indice) => {
      if (!ignoreFlag || theColumn.field != 'banderaUrl') {
        let aCol = { ...theColumn };
        aCol.key = indice.toString();
        this._simpleListColumns.push(aCol);
      }
    });

    return (this._simpleListColumns);
  }

  private _changeColor(color: string): void {
    this._piensaUnTiempo(0.1);
    this.setState({ theme: this._getTheme(color) });
  }

  private _onChangeComboColores(event: ChangeEvent<HTMLSelectElement>): void {
    this._changeColor(event.target.value);
  }

  private _getTheme(themeKey: string): mod.IRCTheme {
    return (this._themes.find((aTheme) => (aTheme.key == themeKey)) || this._themes[this._defaultThemeKey]);
  }

  private _showFlags(checked: boolean): void {
    let dataSource = (checked) ? mod.dataSources.fromURL : mod.dataSources.fromJsonWithDelay;
    this._loadColumns(dataSource != mod.dataSources.fromURL);
    this._downloadCountries(dataSource);
  }

  private _changeLanguage(language: string): void {
    let newLanguage = stringToLanguagesSupported(language);
    if (newLanguage) {
      this._piensaUnTiempo(0.5);
      this._loadStrings(newLanguage);
      this._loadColumns(this.state.dataSource != mod.dataSources.fromURL);
      this._processCountries();
      this.setState({ language: newLanguage });
    }
  }

  private _piensaUnTiempo(segundos: number): void {
    this.setState({ fetchResult: mod.fetchResults.loading });
    setTimeout(() => this.setState({ fetchResult: mod.fetchResults.loadedOk }), segundos * 1000);
  }

  private _onClickButtonConfig(event: any): void {
    this.setState({ hiddenConfig: !this.state.hiddenConfig });
  }

  private _onClickButtonInfo(event: any): void {
    this.setState({ hiddenInfo: !this.state.hiddenInfo });
  }

  private _onChangeCheckBoxCompactMode(): void {
    let checked: boolean = !this.state.isCompactMode;  // event.target.checked
    this.setState({ isCompactMode: checked, });
    this._simpleListRef.current!.setState({ isCompactMode: checked, });
  }

  private _onChangeCheckBoxShowFilter(): void {
    let checked: boolean = !this.state.showFilter;  // event.target.checked
    this.setState({ showFilter: checked, });
    this._simpleListRef.current!.setState({ showFilter: checked, });
  }

  private _processCountries() {
    this._data.forEach((aCountry) => {
      aCountry.alpha3CodeTooltip =
        <Label style={{ fontSize: 'medium', fontWeight: 'lighter' }}>{`${strings.click_ToSeeFlagOf} ${aCountry.name}`}</Label>

      aCountry.banderaJSX =
        <div style={{ padding: '4px', }}>
          <Label style={{ fontSize: 'large', fontWeight: 'lighter' }}>{`${strings.label_FlagOf} ${aCountry.name}`}</Label>
          <div style={{ borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', width: '100%' }}>
            <Image
              src={aCountry.banderaUrl}
              width={'100%'}
            />
          </div>
        </div>
        
      if (aCountry.listLanguages && aCountry.listLanguages.length > 0 && Array.isArray(aCountry.listLanguages)) {
        aCountry.idiomasTooltip =
          <span>
            <Label style={{ fontSize: 'medium', fontWeight: 'lighter' }}>{`${strings.label_Idiomas} ${aCountry.name}`}</Label>
            {
              aCountry.listLanguages.map((aLanguaje: any) => <span key={aLanguaje.key}>{`${aLanguaje.key}: ${aLanguaje.name} (${aLanguaje.nativeName})`}<br /></span>)
            }
          </span>
      }
      // Husos horarios
      if (Array.isArray(aCountry.timezones)) {
        if (aCountry.timezones.length == 1) {
          aCountry.numHusos = aCountry.timezones[0];
        } else {
          aCountry.numHusos = `${aCountry.timezones[0]} (${aCountry.timezones.length - 1}+)`;
          aCountry.husosTooltip =
            <span>
              <Label style={{ fontSize: 'medium', fontWeight: 'lighter' }}>{`${strings.field_NumHusos} ${aCountry.name}`}</Label>
              {aCountry.timezones.join(', ')}
            </span>
        }
      }

    })


  }


  private _downloadCountries(dataSource: mod.dataSources) {
    this.setState({ fetchResult: mod.fetchResults.loading, dataSource: dataSource });
    mod.DownloadCountries(dataSource)
      .then((datos) => {
        this._data = datos;
        this._processCountries();
        this.setState({ numRegs: datos.length, fetchResult: mod.fetchResults.loadedOk });
      })
      .catch((err) => {
        this.setState({ numRegs: 0, fetchResult: mod.fetchResults.loadedErr, fetchResultMessage: err });
      });
  }

  private _renderTitleBar(): JSX.Element {

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

    const iconClass = mergeStyles({
      fontSize: 28,
      // height: 40,
      // width: '100%', 
      color: this.state.theme.slStyle.tableContainerBackgroundColor,
      // margin: '3 0 3 3',
    });

    let menuIdiomas = new Array<IContextualMenuItem>();
    languagesSupported.forEach((aLanguage, index) => {
      menuIdiomas.push({
        key: aLanguage.id,
        text: aLanguage.title,
        canCheck: true,
        isChecked: this.state.language == aLanguage.id,
        onClick: () => { this._changeLanguage(aLanguage.id) }
      })
    })

    let menuColores = new Array<IContextualMenuItem>();
    this._themes.forEach((aTheme) => {
      menuColores.push({
        key: aTheme.key,
        text: aTheme.name,
        canCheck: true,
        isChecked: this.state.theme.key == aTheme.key,
        onClick: () => { this._changeColor(aTheme.key) },
        style: { backgroundColor: aTheme.slStyle.mainContainerBorderColor, color: aTheme.slStyle.mainContainerBackgroundColor }
      })
    })

    const menuItems: IContextualMenuItem[] = [
      {
        key: 'showConfig',
        text: strings.header_ShowConfig,
        onClick: () => { this.setState({ hiddenConfig: !this.state.hiddenConfig }) },
        canCheck: true,
        isChecked: !this.state.hiddenConfig,
      },
      {
        key: 'divider_1',
        itemType: ContextualMenuItemType.Divider,
      },
      {
        key: 'compactMode',
        text: strings.config_CompactMode,
        onClick: this._onChangeCheckBoxCompactMode,
        canCheck: true,
        isChecked: this.state.isCompactMode,
      },
      {
        key: 'showFilter',
        text: '*Mostra els Filtres*',
        onClick: this._onChangeCheckBoxShowFilter,
        canCheck: true,
        isChecked: this.state.showFilter,
      },
      {
        key: 'label',
        text: '*Show Label "Nº Countries"*',
        disabled: !this.state.showFilter,
        onClick: () => { this.setState({ hiddenLabel: !this.state.hiddenLabel }) },
        canCheck: true,
        isChecked: !this.state.hiddenLabel,
      },
      {
        key: 'flags',
        text: strings.label_LoadFromRestcountries,
        onClick: () => { this._showFlags(this.state.dataSource != mod.dataSources.fromURL) },
        canCheck: true,
        isChecked: this.state.dataSource == mod.dataSources.fromURL,
      },
      {
        key: 'idiomas',
        text: strings.config_SelectLanguage,
        subMenuProps: {
          items: menuIdiomas,
        },
      },
      {
        key: 'colors',
        text: strings.config_SelectColors,
        subMenuProps: {
          items: menuColores,
        },
      },
      {
        key: 'divider_2',
        itemType: ContextualMenuItemType.Divider,
      },
      {
        key: 'showInfo',
        text: strings.header_ShowInfo,
        onClick: () => { this.setState({ hiddenInfo: !this.state.hiddenInfo }) },
        canCheck: true,
        isChecked: !this.state.hiddenInfo,
      },
    ]

    return (
      <div style={cssTitleContainer}>
        {/* Icono INFO */}
        <span
          id='spanIconinfoTitle'
          style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
          onClick={this._onClickButtonInfo}
          title={(this.state.hiddenInfo) ? strings.header_ShowInfo : strings.header_HideInfo}
        >
          {/* <IconoInfo fill={this.state.theme.slStyle.tableContainerBackgroundColor} /> */}
          <Icon iconName="Info" className={iconClass} />
        </span>
        {/* Título */}
        <div style={{ verticalAlign: 'middle', width: '100%' }} >
          {strings.title_App} (versión FluentUI en construcción)
          <small>
            {` (${strings.agradecimiento} `}
            <a target='_blank'
              style={{ color: this.state.theme.slStyle.tableContainerBackgroundColor }}
              href={mod.URL_RESTCOUNTRIES_SITE}>
              {mod.URL_RESTCOUNTRIES_SITE}
            </a>{')'}
          </small>
        </div>
        {/* Icono Configuración */}
        <span
          style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer', margin: '2px', }}
          // onClick={this._onClickButtonConfig}
          title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
        >
          {/* <IconoConfig fill={this.state.theme.slStyle.tableContainerBackgroundColor} /> */}
          {/* <Icon iconName="CollapseMenu" className={iconClass} /> */}
          <IconButton
            iconProps={{ iconName: 'CollapseMenu', className: iconClass }}
            menuProps={{ items: menuItems }}
            menuIconProps={{ iconName: '', hidden: true }}
            title="Show Menu" ariaLabel="Show Menu"
          />
        </span>
      </div>
    )
  }

  private _renderInfo(): JSX.Element {
    let cssInfoContainer: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      paddingTop: '2px',
      width: '100%',
      height: '40px',
      borderStyle: 'solid',
      borderBottomColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '1px',
      backgroundColor: this.state.theme.slStyle.tableContainerBackgroundColor,

    }

    const iconClass = mergeStyles({
      fontSize: 28,
      // height: 40,
      // width: '100%', 
      color: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      margin: 3,
    });


    return (
      // <Callout
      //   onDismiss={this._onClickButtonInfo}
      //   coverTarget={true}
      //   target='#spanIconinfoTitle'
      // >
      <div style={cssInfoContainer}>
        {/* Icono Info */}
        <span
          style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
          onClick={this._onClickButtonInfo}
          title={(this.state.hiddenInfo) ? strings.header_ShowInfo : strings.header_HideInfo}
        >
          <Icon iconName="Info" className={iconClass} />
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
          <span style={{ verticalAlign: 'middle', fontSize: '0.8em', textAlign: 'left' }}>
            {simpleListFluentUIVersionLabel}<br />{restCountriesFluentUIVersionLabel}
          </span>

          <span style={{ verticalAlign: 'middle' }}>
            ©2020 <a target="_blank" href="mailto:lmoreso@yahoo.com" title="Envía un e-mail al autor">Lluís Moreso Bosch</a>
          </span>

          <span style={{ verticalAlign: 'middle' }}>
            <a
              style={{ verticalAlign: 'middle', height: '100%', display: 'flex', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', }}
              target="_blank" href="https://es.linkedin.com/pub/lluis-moreso-bosch/3b/381/663"
              title="Visita mi perfil en LinkedIn"
            >
              <Icon iconName="LinkedInLogo" className={iconClass} />
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
          <Icon iconName="Cancel" className={iconClass} />
        </span>
      </div>
      // </Callout>

    )

  }

  private _renderConfig(): JSX.Element {
    let cssConfigBody: React.CSSProperties = {
      margin: '2px 2px 2px 2px',
      verticalAlign: 'baseline',
    }

    let cssConfigContainer: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      paddingTop: '2px',
      width: '100%',
      height: '60px',
      borderStyle: 'solid',
      borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '1px',
      backgroundColor: this.state.theme.slStyle.tableContainerBackgroundColor,
    };

    const iconClass = mergeStyles({
      fontSize: 28,
      // height: 40,
      // width: '100%', 
      color: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      // margin: '3 0 3 3',
    });

    const styleToggle = (checked: boolean): React.CSSProperties => {
      if (checked)
        return ({
          color: this.state.theme.slStyle.tableContainerBackgroundColor,
          backgroundColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
        })
      else
        return ({
          backgroundColor: this.state.theme.slStyle.tableContainerBackgroundColor,
          color: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
        })
    }

    return (
      <div style={cssConfigContainer}>
        {/* Icono Configuración */}
        <span
          style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
          onClick={this._onClickButtonConfig}
          title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
        >
          {/* <IconoConfig fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} /> */}
          <Icon iconName="Settings" className={iconClass} />
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
          <span style={cssConfigBody}>
            <Toggle
              // hidden={!this.props.showToggleCompactMode}
              label={strings.config_CompactMode}
              checked={this.state.isCompactMode}
              onChange={this._onChangeCheckBoxCompactMode}
              // onText={strings.config_CompactMode}
              // offText={strings.config_CompactMode}
              style={styleToggle(this.state.isCompactMode)}
            />
          </span>

          {/* Combo idiomas */}
          <label style={cssConfigBody}>
            {strings.config_SelectLanguage}
            <Dropdown
              selectedKey={this.state.language}
              onChange={(ev: any, option: IDropdownOption) => { this._changeLanguage(option.key.toString()) }}
              options={this._comboIdiomas}
              // styles={controlStyles}
              style={{ minWidth: 140 }}
            />
          </label>

          {/* Checkbox dataSource */}
          <span style={cssConfigBody}>
            <Toggle
              // hidden={!this.props.showToggleCompactMode}
              label={strings.label_LoadFromRestcountries}
              checked={this.state.dataSource == mod.dataSources.fromURL}
              onChange={() => this._showFlags(this.state.dataSource != mod.dataSources.fromURL)}
              // onText={strings.config_CompactMode}
              // offText={strings.config_CompactMode}
              style={styleToggle(this.state.dataSource == mod.dataSources.fromURL)}
            />
          </span>

          {/* Combo colores */}
          <label style={cssConfigBody}>
            {strings.config_SelectColors}
            {/* <select style={{ textAlign: 'center', marginLeft: '2px' }} value={(this.state.theme.key)} onChange={this._onChangeComboColores}>
              {this._themes.map((aTheme, index) => {
                return (
                  <option key={aTheme.key} value={aTheme.key}>
                    {`${aTheme.name}`}
                  </option>
                )
              })}
            </select> */}
            <Dropdown
              selectedKey={this.state.theme.key}
              onChange={(ev: any, option: IDropdownOption) => { this._changeColor(option.key.toString()) }}
              options={this._comboColores}
              // styles={controlStyles}
              style={{ minWidth: 140 }}
            />
          </label>
        </div>

        {/* Icono Cerrar */}
        <span
          style={{ verticalAlign: 'middle', width: '40px', cursor: 'pointer' }}
          onClick={this._onClickButtonConfig}
          title={(this.state.hiddenConfig) ? strings.header_ShowConfig : strings.header_HideConfig}
        >
          {/* <IconoCerrar fill={this.state.theme.slStyle.tableHeaderCellBackgroundColor} /> */}
          <Icon iconName="Cancel" className={iconClass} />
        </span>
      </div>

    )
  }

  private _renderHeader(): JSX.Element {


    let cssMainContainer: React.CSSProperties = {
      width: this.props.width || ((this.state.dataSource == mod.dataSources.fromURL) ? mod.DEFAULT_WIDTH_WIHT_FLAG : mod.DEFAULT_WIDTH),
      // borderStyle: 'solid',
      // borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      // borderWidth: '1px',
    }

    return (
      <div style={cssMainContainer}>
        {/* Barra de Título */}
        <this._renderTitleBar />

        {/* Créditos */}
        {this.state.hiddenInfo ? null : <this._renderInfo />}

        {/* Configuración */}
        {(this.state.hiddenConfig) ? null : <this._renderConfig />}
      </div>
    );
  }

  public render(): JSX.Element {
    // console.log('RestCountriesExample render', 'ver config?', this.state.hiddenConfig);
    let mainStyle = {
      width: this.props.width || ((this.state.dataSource == mod.dataSources.fromURL) ? mod.DEFAULT_WIDTH_WIHT_FLAG : mod.DEFAULT_WIDTH),
      borderStyle: 'solid',
      borderColor: this.state.theme.slStyle.tableHeaderCellBackgroundColor,
      borderWidth: '2px',
      backgroundColor: this.state.theme.slStyle.tableContainerBackgroundColor,
    }

    if (this.state.fetchResult == mod.fetchResults.loading) {
      return (
        <div style={mainStyle}>
          <this._renderHeader />
          <Label> {strings.model_Loading}</Label>
          <div style={{ height: '60px' }}>
            <Spinner
              size={SpinnerSize.large}
              style={{ color: this.state.theme.slStyle.tableHeaderCellBackgroundColor }}
            />
          </div>
        </div>
      );
    } else if (this.state.fetchResult == mod.fetchResults.loadedErr) {
      return (
        <div style={mainStyle}>
          <this._renderHeader />
          <h1>Se ha producido un error:</h1>
          <p>{this.state.fetchResultMessage}</p>
        </div>
      );
    } else {
      return (
        <div style={mainStyle}>
          <this._renderHeader />
          <SimpleListFluentUI
            ref={this._simpleListRef}
            hidden={false}
            data={this._data}
            labelItem={strings.label_Pais}
            labelItems={strings.label_Paises}
            columns={this._simpleListColumns}
            isCompactMode={this.state.isCompactMode}
            showToggleCompactMode={false}
            showLabel={!this.state.hiddenLabel}
            heightInPx={this.props.height || mod.DEFAULT_HEIGHT}
            language={this.state.language}
            theme={this.state.theme.slStyle}
            showFilter={this.state.showFilter}
          />
        </div>
      )
    }
  }
}



