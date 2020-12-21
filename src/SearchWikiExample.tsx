import * as React from 'react';
import { Modal, SelectableOptionMenuItemType, } from 'office-ui-fabric-react';
import { ActionButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { getTheme, ITheme, } from 'office-ui-fabric-react/lib/Styling';

import { panelOrientations, SearchWiki } from './lib/SimpleList/SearchWiki';

export interface SearchWikiExampleProps {

}

const comboIdiomes: Array<IDropdownOption> = [
  { key: 'EN', text: 'https://en.wikipedia.org' },
  { key: 'ES', text: 'https://es.wikipedia.org' },
  { key: 'FR', text: 'https://fr.wikipedia.org' },
  { key: 'CA', text: 'https://ca.wikipedia.org' },
];

const comboOrientation: Array<IDropdownOption> = [
  { key: panelOrientations.landscape, text: 'Apaisado' },
  { key: panelOrientations.portrait, text: 'Vertical' },
  { key: panelOrientations.auto, text: 'Automático' },
];


interface ISearchWikiPropsStates {
  wikiUrl: IDropdownOption;
  panelOrientation: IDropdownOption;
  textToSearch: string;
  numPagesToSearch: number;
  fixedSize: number;
  plainText: boolean;
  numChars: number;
  numSentences: number,
  imageSize: number,
  enDesarrollo: boolean;
  bordeYSombra: boolean;
}

interface ISearchWikiExampleEstates extends ISearchWikiPropsStates {
  canUpdate: boolean;
  confBusqueda: boolean;
  isPanelOpen: boolean;
  selectComboTextKey: string | number;
  isModalOpen: boolean;
}

export class SearchWikiExample extends React.Component<SearchWikiExampleProps, ISearchWikiExampleEstates> {
  private _theme: ITheme = getTheme();
  private _searchWikiProps: ISearchWikiPropsStates = {
    wikiUrl: comboIdiomes[1],
    textToSearch: 'Guernica, pintura de Picasso',
    fixedSize: 250,
    numChars: 300,
    plainText: true,
    numSentences: 0,
    imageSize: 250,
    enDesarrollo: false,
    panelOrientation: comboOrientation[2],
    bordeYSombra: true,
    numPagesToSearch: 10,
  };

  public constructor(props: SearchWikiExampleProps) {
    super(props);

    this.state = {
      ...this._searchWikiProps,
      canUpdate: false,
      confBusqueda: true,
      isPanelOpen: false,
      selectComboTextKey: 'C',
      isModalOpen: false,
    }

    // this._renderHeader = this._renderHeader.bind(this);
  }

  public componentDidMount() {

  }

  public render(): JSX.Element {
    let estilo = { margin: '10px', };
    let controlStyles = { root: { margin: '0 10px 10px 10px', width: '300px', } };
    let labelStyles = { root: { textAlign: 'left', fontSize: 'smaller', marginLeft: '10px', } };

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', /* maxWidth: '1600px',  */ }}>
        <div style={{
          display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', margin: '10px',
          borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray',
          boxShadow: '5px 0px 5px gray'
        }}
        >
          <Label style={{ fontSize: 'large', fontWeight: 'lighter', /* marginLeft: '10px',  */ }}>{'Configuración <SearchWiki/>'}</Label>
          <Pivot
            linkSize={PivotLinkSize.large}
            linkFormat={PivotLinkFormat.tabs}
            styles={{
              root: {
                borderBottom: `solid 1px ${this._theme.semanticColors.inputBackgroundChecked}`,
                textAlign: 'left',
              }
            }}
          >
            <PivotItem headerText="Búsqueda" itemIcon="Globe">
              <div>
                <Label styles={labelStyles}>{'Texto a buscar en la Wiki'}</Label>
                <ComboBox
                  selectedKey={this.state.selectComboTextKey}
                  allowFreeform={true}
                  autoComplete={'on'}
                  text={this.state.textToSearch}
                  options={[
                    { key: 'Header1', text: 'Castellano', itemType: SelectableOptionMenuItemType.Header },
                    { key: 'A', text: 'Barcelona' },
                    { key: 'B', text: 'Picasso' },
                    { key: 'C', text: 'Guernica, pintura de Picasso' },
                    { key: 'D', text: 'Belgrado' },
                    { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
                    { key: 'Header2', text: 'English', itemType: SelectableOptionMenuItemType.Header },
                    { key: 'E', text: 'Picasso' },
                    { key: 'F', text: 'Barcelone' },
                    { key: 'G', text: 'Belgrade' },
                  ]}
                  styles={controlStyles}
                  onChange={(ev, op: IComboBoxOption, index: number, newValue: string) => {
                    let newText = (op) ? op.text : newValue;
                    if (newText && newText.length) {
                      if (op)
                        this.setState({ textToSearch: newText, selectComboTextKey: op.key, canUpdate: true })
                      else
                        this.setState({ textToSearch: newText, canUpdate: true })

                    }
                  }}
                />
                <Label styles={labelStyles}>{'URL de la Wiki'}</Label>
                <Dropdown
                  // label={'URL de la Wiki'}
                  selectedKey={this.state.wikiUrl.key}
                  onChange={(ev, option) => {
                    if (option) this.setState({ wikiUrl: option!, canUpdate: true });
                  }}
                  options={comboIdiomes}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Texto Plano | HTML'}</Label>
                <Toggle
                  // label={'Texto Plano | HTML'}
                  checked={this.state.plainText}
                  onChange={(event: any, checked: boolean | undefined): void => {
                    this.setState({ plainText: checked!, canUpdate: true });
                  }}
                  onText={'Devuelve Texto plano'}
                  offText={'Devuelve HTML'}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Nº de caracteres a recuperar (de 200 a 1200)'}</Label>
                <Slider
                  // label="Nº de caracteres a recuperar (de 200 a 1200)"
                  min={0}
                  max={1200}
                  step={50}
                  value={(this.state.numSentences) ? 0 : this.state.numChars}
                  showValue
                  onChange={(value: number): void => {
                    this.setState({ numChars: value, numSentences: (value) ? 0 : 5, canUpdate: true });
                  }}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Nº de Sentencias a recuperar (de 1 a 10)'}</Label>
                <Slider
                  // label="Nº de Sentencias a recuperar (de 1 a 10)"
                  min={0}
                  max={10}
                  step={1}
                  value={(this.state.numChars) ? 0 : this.state.numSentences}
                  showValue
                  onChange={(value: number): void => {
                    this.setState({ numSentences: value, numChars: (value) ? 0 : 600, canUpdate: true });
                  }}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Tamaño de la imagen (de 50 a 1000)'}</Label>
                <Slider
                  // label="tamaño de la imagen (de 50 a 1000)"
                  min={50}
                  max={1000}
                  step={50}
                  value={this.state.imageSize}
                  showValue
                  onChange={(value: number): void => {
                    this.setState({ imageSize: value, canUpdate: true });
                  }}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Nº de páginas a recuperar (de 1 a 20)'}</Label>
                <Slider
                  // label="tamaño de la imagen (de 50 a 1000)"
                  min={1}
                  max={20}
                  step={1}
                  value={this.state.numPagesToSearch}
                  showValue
                  onChange={(value: number): void => {
                    this.setState({ numPagesToSearch: value, canUpdate: true });
                  }}
                  styles={controlStyles}
                />
                <DefaultButton
                  onClick={(ev) => {
                    this._searchWikiProps = this.state;
                    this.setState({ canUpdate: false })
                    // this.forceUpdate();
                  }}
                  styles={controlStyles}
                  disabled={!this.state.canUpdate}
                >
                  Busca en Wikipedia
                </DefaultButton>
              </div>
            </PivotItem>
            <PivotItem headerText="Formato" itemIcon="DeveloperTools">
              <div style={{
                display: 'flex', flexDirection: 'column',
              }}>
                <Label styles={labelStyles}>{'Modo de Depuración'}</Label>
                <Toggle
                  // label={'Mostrar respuesta JSON'}
                  checked={this.state.enDesarrollo}
                  onChange={(event: any, checked?: boolean | undefined): void => {
                    this._searchWikiProps.enDesarrollo = checked!;
                    this.setState({ enDesarrollo: checked! });
                  }}
                  onText={'Desactivar Depuración'}
                  offText={'Activar Depuración'}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Tamaño fijado del panel'}</Label>
                <Slider
                  // label="Tamaño fijado del panel"
                  min={200}
                  max={900}
                  step={50}
                  defaultValue={this.state.fixedSize}
                  showValue
                  onChange={(value: number): void => {
                    this._searchWikiProps.fixedSize = value;
                    this.setState({ fixedSize: value });
                  }}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Orientación'}</Label>
                <Dropdown
                  // label={'Orientación'}
                  selectedKey={this.state.panelOrientation.key}
                  onChange={(ev, option) => {
                    if (option) {
                      this._searchWikiProps.panelOrientation = option;
                      this.setState({ panelOrientation: option, });
                    }
                  }}
                  options={comboOrientation}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Borde y Sombra'}</Label>
                <Toggle
                  // label={'Mostrar respuesta JSON'}
                  checked={this.state.bordeYSombra}
                  onChange={(event: any, checked?: boolean | undefined): void => {
                    this._searchWikiProps.bordeYSombra = checked!;
                    this.setState({ bordeYSombra: checked! });
                  }}
                  onText={'Quitar borde y sombra'}
                  offText={'Añadir borde y sombra'}
                  styles={controlStyles}
                />
                <Label styles={labelStyles}>{'Otros ejemplos de Uso'}</Label>
                <ActionButton
                  onClick={(ev) => {
                    this.setState({ isPanelOpen: true })
                  }}
                  styles={controlStyles}
                >
                  Abrir Panel derecho (Orientación vertical, 5 páginas)
                </ActionButton>
                <ActionButton
                  onClick={(ev) => {
                    this.setState({ isModalOpen: true })
                  }}
                  styles={controlStyles}
                >
                  Abrir Panel central (Orientación horizontal, 5 páginas)
                </ActionButton>
                <TooltipHost
                  tooltipProps={{
                    onRenderContent: () =>
                      <SearchWiki
                        textToSearch={this._searchWikiProps.textToSearch}
                        rootUrl={this._searchWikiProps.wikiUrl.text}
                        fixedSize={this._searchWikiProps.fixedSize}
                        numChars={this._searchWikiProps.numChars}
                        numPagesToSearch={1}
                        numSentences={this._searchWikiProps.numSentences}
                        plainText={this._searchWikiProps.plainText}
                        imageSize={this._searchWikiProps.imageSize}
                        panelOrientation={panelOrientations.auto}
                      />
                  }}
                  calloutProps={{
                    gapSpace: 0,
                    calloutMaxWidth: 600,
                  }}
                >
                  <ActionButton
                    styles={controlStyles}
                  >
                    Pasa el ratón para ver el 'Tooltip' (Orientación automática, 1 sola página)
                  </ActionButton>
                </TooltipHost>
                <Panel
                  isLightDismiss
                  isOpen={this.state.isPanelOpen}
                  onDismiss={() => this.setState({ isPanelOpen: false })}
                >
                  <SearchWiki
                    textToSearch={this._searchWikiProps.textToSearch}
                    rootUrl={this._searchWikiProps.wikiUrl.text}
                    fixedSize={this._searchWikiProps.fixedSize}
                    numChars={this._searchWikiProps.numChars}
                    numPagesToSearch={5}
                    numSentences={this._searchWikiProps.numSentences}
                    plainText={this._searchWikiProps.plainText}
                    imageSize={this._searchWikiProps.imageSize}
                    panelOrientation={panelOrientations.portrait}
                  />
                </Panel>
                <Modal
                  isOpen={this.state.isModalOpen}
                  onDismiss={() => this.setState({ isModalOpen: false })}
                >
                  <SearchWiki
                    textToSearch={this._searchWikiProps.textToSearch}
                    rootUrl={this._searchWikiProps.wikiUrl.text}
                    fixedSize={this._searchWikiProps.fixedSize}
                    numChars={this._searchWikiProps.numChars}
                    numPagesToSearch={5}
                    numSentences={this._searchWikiProps.numSentences}
                    plainText={this._searchWikiProps.plainText}
                    imageSize={this._searchWikiProps.imageSize}
                    panelOrientation={panelOrientations.landscape}
                  />
                </Modal>

              </div>
            </PivotItem>
          </Pivot>
          <div style={{ margin: '10px' }}></div>
          {/* </Panel> */}
        </div>
        <div style={{ ...estilo, backgroundColor: 'white', }}>
          <SearchWiki
            textToSearch={this._searchWikiProps.textToSearch}
            rootUrl={this._searchWikiProps.wikiUrl.text}
            numPagesToSearch={this._searchWikiProps.numPagesToSearch}
            fixedSize={this._searchWikiProps.fixedSize}
            numChars={this._searchWikiProps.numChars}
            enDesarrollo={this._searchWikiProps.enDesarrollo}
            numSentences={this._searchWikiProps.numSentences}
            plainText={this._searchWikiProps.plainText}
            imageSize={this._searchWikiProps.imageSize}
            panelOrientation={this._searchWikiProps.panelOrientation.key as panelOrientations}
            rootStyle={(!this._searchWikiProps.bordeYSombra) ? undefined : {
              border: '1px solid gray',
              boxShadow: '5px 5px 5px gray',
            }}
          />
        </div>
      </div>
    )
  }
}
