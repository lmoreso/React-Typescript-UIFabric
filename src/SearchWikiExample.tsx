import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
// import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
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

export interface SearchWikiExampleEstates {
  wikiUrl: IDropdownOption;
  textToSearch: string;
  fixedSize: number;
  plainText: boolean;
  numChars: number;
  numSentences: number,
  imageSize: number,
  enDesarrollo: boolean;
  panelOrientation: IDropdownOption;
  canUpdate?: boolean;
}

export class SearchWikiExample extends React.Component<SearchWikiExampleProps, SearchWikiExampleEstates> {

  private _searchWikiProps: SearchWikiExampleEstates = {
    wikiUrl: comboIdiomes[0],
    textToSearch: 'Belgrade',
    fixedSize: 250,
    numChars: 0,
    plainText: true,
    numSentences: 3,
    imageSize: 250,
    enDesarrollo: true,
    panelOrientation: comboOrientation[0],
  };

  public constructor(props: SearchWikiExampleProps) {
    super(props);

    this.state = {
      ...this._searchWikiProps,
      canUpdate: false,
    }

    // this._renderHeader = this._renderHeader.bind(this);
  }

  public componentDidMount() {

  }

  public render(): JSX.Element {
    let estilo = { margin: '10px', };
    let controlStyles = { root: { margin: '0 10px 10px 10px', width: '300px', } };
    let labelStyles = { root: { textAlign: 'left', fontSize: 'smaller', marginLeft: '10px', } };
    // let titleStyles = { root: { textAlign: 'center', fontSize: 'large', marginLeft: '10px', } };
    // let titleStyles = { fontSize: 'large', fontWeight: 'lighter', marginLeft: '10px', }

    // console.log('render()', this.state);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', /* maxWidth: '1600px',  */ }}>
        <div style={{
          display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', margin: '10px',
          borderStyle: 'solid', borderWidth: '1px', borderColor: 'gray',
          // borderLeftStyle: 'solid', borderLeftWidth: '1px', borderLeftColor: 'gray',
          // width: '300px',
          // height: '100%',
          boxShadow: '5px 0px 5px gray'
        }}
        >
        {/* <Panel
          isBlocking={false}
          isOpen={true}
          hasCloseButton={false}
          styles={{}}
        > */}
          <Label style={{ fontSize: 'large', fontWeight: 'lighter', marginLeft: '10px', }}>{'Configuración de la búsqueda'}</Label>
          <Label styles={labelStyles}>{'Texto a buscar en la Wiki'}</Label>
          <SearchBox
            placeholder="Texto a buscar en la Wiki"
            // onSearch={(text: string): void => {this.setState({textToSearch: text})}}
            onChange={(newValue: string) => {
              this.setState({ textToSearch: newValue, canUpdate: (newValue && newValue.length) ? true : false })
            }}
            value={this.state.textToSearch}
            styles={controlStyles}
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
          <Label style={{ fontSize: 'large', fontWeight: 'lighter', marginLeft: '10px', }}>{'Configuración de Formato'}</Label>
          <Label styles={labelStyles}>{'Mostrar la respuesta JSON'}</Label>
          <Toggle
            // label={'Mostrar respuesta JSON'}
            checked={this.state.enDesarrollo}
            onChange={(event: any, checked?: boolean | undefined): void => {
              this._searchWikiProps.enDesarrollo = checked!;
              this.setState({ enDesarrollo: checked! });
            }}
            onText={'Mostrando JSON'}
            offText={'JSON invisible'}
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
        {/* </Panel> */}
        </div>
        <div style={{ ...estilo, backgroundColor: 'white', }}>
          <SearchWiki
            textToSearch={this._searchWikiProps.textToSearch}
            rootUrl={this._searchWikiProps.wikiUrl.text}
            fixedSize={this._searchWikiProps.fixedSize}
            numChars={this._searchWikiProps.numChars}
            enDesarrollo={this._searchWikiProps.enDesarrollo}
            numSentences={this._searchWikiProps.numSentences}
            plainText={this._searchWikiProps.plainText}
            imageSize={this._searchWikiProps.imageSize}
            panelOrientation={this._searchWikiProps.panelOrientation.key as panelOrientations}
          />
        </div>
      </div>
    )
  }
}
