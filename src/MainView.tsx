import * as React from 'react';
// Fluent UI imports
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

// Aplicattion imports
import { DetailsListDocumentsExample } from './FluentUiExamples/DetailListDocumentsExample';
import { ScrollablePaneDetailsListExample } from './FluentUiExamples/ScrollablePaneExample';
import { RestCountriesHTML } from './RestCountriesExample/RestCountriesHTML';
import { RestCountriesUIFabric } from './RestCountriesExample/RestCountriesUIFabric';
import { RestCountriesFluentUI } from './RestCountriesExample/RestCountriesFluentUI';
import { SearchWikiExample } from './lib/SearchWiki/SearchWikiExample';


// La primera opció no funciona en producció si la aplicació no està al arrel.
// import logo from './logo.svg';
// La segona opció si que funciona, sempre que no vingui res estrany a la URL ...
// let logo = window.location.origin + window.location.pathname + 'img/logo.svg'; // Tiene que estar en la carpeta public.
// la tercera opció també funciona:
const logo = `${process.env.PUBLIC_URL}img/logo.svg`; // Tiene que estar en la carpeta public.

const REACT_URL = 'https://reactjs.org/';
const TYPESCRIPT_URL = 'https://www.typescriptlang.org/docs/home.html';
const FLUENT_UI_URL = 'https://developer.microsoft.com/en-us/fluentui#/controls/web';
const UI_FABRIC_URL = 'https://developer.microsoft.com/en-us/office/blogs/ui-fabric-is-evolving-into-fluent-ui';

enum menuOptionsId { restCountriesUIFabric = 1, restCountriesHtml, fabricListDocExample, scrollablePaneExample, restCountriesFluentUI, searchWiki }
const DEF_MENU_ID: menuOptionsId = menuOptionsId.searchWiki;

interface IMenuOptions {
  key: menuOptionsId;
  name: string;
  loadCountries: boolean;
  title: string;
}

const menuOptions: IMenuOptions[] = [
  { key: menuOptionsId.restCountriesFluentUI, name: 'Paises y Banderas del Mundo (FluentUI versión)', loadCountries: false, title: 'Paises y Banderas del Mundo (FluentUI versión)' },
  { key: menuOptionsId.searchWiki, name: 'Busca en Wikipedia', loadCountries: false, title: 'Busca en Wikipedia' },
  { key: menuOptionsId.restCountriesUIFabric, name: 'Paises y Banderas del Mundo (UIFabric versión)', loadCountries: true, title: 'Paises y Banderas del Mundo (UIFabric versión)' },
  { key: menuOptionsId.restCountriesHtml, name: 'Paises y Banderas del Mundo (HTML versión)', loadCountries: true, title: 'Paises y Banderas del Mundo (HTML versión)' },
  { key: menuOptionsId.fabricListDocExample, name: 'Ejemplo de Lista de UI Fabric', loadCountries: false, title: 'Ejemplo de Lista de UI Fabric' },
  { key: menuOptionsId.scrollablePaneExample, name: 'Ejemplo de Scrollablepane de UI Fabric', loadCountries: false, title: 'Ejemplo de Scrollablepane de UI Fabric' },
]

interface IMainViewStates {
  activeMenuOptionId: menuOptionsId;
}

export interface IMainViewProps { };

export class MainView extends React.Component<IMainViewProps, IMainViewStates> {
  private _isMenuActive = (menuOptionId: menuOptionsId): boolean => (this.state.activeMenuOptionId === menuOptionId);
  // private _getActiveMenuOption = (): IMenuOptions => {
  //   let menuOption = menuOptions.find((value: IMenuOptions, index, obj) => (this._isMenuActive(value.key)));
  //   if (menuOption == undefined) throw `No hay ninguna opción seleccionada`;
  //   return (menuOption);
  // }
  private _optionsComboMenu: { key: number; text: string }[];

  public constructor(props: IMainViewProps) {
    super(props);

    // Inicializar estados
    this.state = { activeMenuOptionId: DEF_MENU_ID }

    // Rellenar opciones para el combo de las opciones de menú
    this._optionsComboMenu = new Array();
    menuOptions.forEach((unMenu => {
      this._optionsComboMenu.push({ key: unMenu.key, text: unMenu.name })
    }))

  }

  private _onChangeComboMenu = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({ activeMenuOptionId: item.key as menuOptionsId });
  };

  /*   private _onChangeComboOrigenDatos = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      console.log(`Cambiado origen de datos a ${item.key} (${item.text})`)
      this.setState({ estado: fetchStatus.Cargando });
      this._descargarPaises(item.key as origenesDatos);
    };
   */
  public render(): JSX.Element {
    return (
      <div>
        <Fabric>
          <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
            <Sticky stickyPosition={StickyPositionType.Header}>
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">
                  Exercices about <a className="App-title" href={REACT_URL} target='_blank'>React</a>, <a className="App-title" href={TYPESCRIPT_URL} target='_blank'>Typescript</a> & <a className="App-title" href={FLUENT_UI_URL} target='_blank'>Fluent UI</a> (<a className="App-title" href={UI_FABRIC_URL} target='_blank'> UIFabric</a>)
                </span>
              </header>
            </Sticky>
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
              <Sticky >
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px', alignSelf: 'center', backgroundColor: 'rgba(150, 150, 150)', width: '100%' }}>
                  <Label style={{ padding: '5px', paddingTop: '10px' }}> Selecciona una opción: </Label>
                  <Dropdown
                    // defaultSelectedKey={this.state.activeMenuOptionId ? this.state.activeMenuOptionId : undefined}
                    selectedKey={this.state.activeMenuOptionId ? this.state.activeMenuOptionId : undefined}
                    onChange={this._onChangeComboMenu}
                    placeholder="Select an option"
                    options={this._optionsComboMenu}
                    styles={{ dropdown: { width: 400, padding: '5px' } }}

                  />
                </div>
              </Sticky>
              <div style={{ padding: '5px', alignSelf: 'center', justifyContent: 'center' }}>

                <DetailsListDocumentsExample
                  hidden={!this._isMenuActive(menuOptionsId.fabricListDocExample)}
                />

                {(this._isMenuActive(menuOptionsId.scrollablePaneExample)) ? <ScrollablePaneDetailsListExample /> : null}

                {(!this._isMenuActive(menuOptionsId.restCountriesUIFabric)) ? null :
                  <RestCountriesUIFabric />
                }

                {(!this._isMenuActive(menuOptionsId.restCountriesHtml)) ? null :
                  <RestCountriesHTML />
                }

                {(!this._isMenuActive(menuOptionsId.searchWiki)) ? null :
                  <SearchWikiExample />
                }

                {(!this._isMenuActive(menuOptionsId.restCountriesFluentUI)) ? null :
                  <RestCountriesFluentUI />
                }
              </div>
            </div>
          </ScrollablePane>
        </Fabric>

      </div>
    );
  }
}



