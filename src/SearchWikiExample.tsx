import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import { SearchWiki } from './lib/SimpleList/SearchWiki';

export interface SearchWikiExampleProps {

}

const comboIdiomes: Array<IDropdownOption> = [
  { key: 'EN', text: 'https://en.wikipedia.org' },
  { key: 'ES', text: 'https://es.wikipedia.org' },
  { key: 'FR', text: 'https://fr.wikipedia.org' },
  { key: 'CA', text: 'https://ca.wikipedia.org' },
];

export interface SearchWikiExampleEstates {
  wikiUrl: IDropdownOption;
  textToSearch: string;
  maxWidth: number;
  plainText?: boolean;
  numChars?: number;
  numSentences?: number,
  enDesarrollo?: boolean;
  canUpdate?: boolean;
}

export class SearchWikiExample extends React.Component<SearchWikiExampleProps, SearchWikiExampleEstates> {

  private _searchWikiProps: SearchWikiExampleEstates = {
    wikiUrl: comboIdiomes[0],
    textToSearch: 'Barcelona',
    maxWidth: 350,
    numChars: 900,
    plainText: true,
    numSentences: 0,
    enDesarrollo: true,
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
    let estilo = { margin: '10px' };
    let estilos = { root: { margin: '10px', } };
    console.log('render()', this.state);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', maxWidth: '1600px', }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', margin: '10px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black', }}>
          <SearchBox
            placeholder="Text a buscar"
            // onSearch={(text: string): void => {this.setState({textToSearch: text})}}
            onChange={(newValue: string) => {
              this.setState({ textToSearch: newValue, canUpdate: (newValue && newValue.length) ? true : false })
            }}
            value={this.state.textToSearch}
            styles={estilos}
          />
          <Dropdown
            selectedKey={this.state.wikiUrl.key}
            onChange={(ev, option) => {
              if (option) this.setState({ wikiUrl: option!, canUpdate: true });
            }}
            options={comboIdiomes}
            styles={estilos}
          />
          <Toggle
            // label={strings.config_CompactMode}
            checked={this.state.plainText}
            onChange={(event: any, checked?: boolean | undefined): void => {
              this.setState({ plainText: checked, canUpdate: true });
            }}
            onText={'Devuelve Texto plano'}
            offText={'Devuelve HTML'}
            styles={estilos}
          />
          <Slider
            label="Nº de caracteres a recuperar"
            min={0}
            max={1200}
            step={50}
            value={(this.state.numSentences) ? 0 : this.state.numChars}
            showValue
            onChange={(value: number): void => {
              this.setState({ numChars: value, numSentences:  (value) ? 0 : 5, canUpdate: true });
            }}
            styles={estilos}
          />
          <Slider
            label="Nº de Sentencias a recuperar"
            min={0}
            max={10}
            step={1}
            value={(this.state.numChars) ? 0 : this.state.numSentences}
            showValue
            onChange={(value: number): void => {
              this.setState({ numSentences: value, numChars: (value) ? 0 : 600, canUpdate: true });
            }}
            styles={estilos}
          />
          <DefaultButton
            onClick={(ev) => {
              this._searchWikiProps = this.state;
              this.setState({ canUpdate: false })
              // this.forceUpdate();
            }}
            styles={estilos}
            disabled={!this.state.canUpdate}
          >
            Busca en Wikipedia
          </DefaultButton>
          <Toggle
            // label={strings.config_CompactMode}
            checked={this.state.enDesarrollo}
            onChange={(event: any, checked?: boolean | undefined): void => {
              this._searchWikiProps.enDesarrollo = checked;
              this.setState({ enDesarrollo: checked });
            }}
            onText={'Mostrando JSON'}
            offText={'JSON invisible'}
            styles={estilos}
          />
          <Slider
            label="Ancho del Panel"
            min={300}
            max={900}
            step={50}
            defaultValue={this.state.maxWidth}
            showValue
            onChange={(value: number): void => {
              this._searchWikiProps.maxWidth = value;
              this.setState({ maxWidth: value });
            }}
            styles={estilos}
          />
          {/* <Toggle
            // label={strings.config_CompactMode}
            checked={this.state.apaisado}
            onChange={(event: any, checked?: boolean | undefined): void => {
              this._searchWikiProps.apaisado = checked;
              this.setState({ apaisado: checked });
            }}
            onText={'Apaisado'}
            offText={'Vertical'}
            styles={estilos}
          /> */}
        </div>
        <div style={estilo}>
          <SearchWiki
            textToSearch={this._searchWikiProps.textToSearch}
            rootUrl={this._searchWikiProps.wikiUrl.text}
            maxWidth={this._searchWikiProps.maxWidth}
            numChars={this._searchWikiProps.numChars}
            enDesarrollo={this._searchWikiProps.enDesarrollo}
            numSentences={this._searchWikiProps.numSentences}
            plainText={this._searchWikiProps.plainText}
          />
        </div>
      </div>
    )
  }
}
