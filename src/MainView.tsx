import * as React from 'react';
// Fluent UI imports
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
// import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, /* StickyPositionType */ } from 'office-ui-fabric-react/lib/Sticky';

// Aplicattion imports
import { DetailsListDocumentsExample } from './FluentUiExamples/DetailListDocumentsExample';
import { ScrollablePaneDetailsListExample } from './FluentUiExamples/ScrollablePaneExample';
import { RestCountriesExample } from './RestCountriesExample/RestCountriesExample';

enum menuOptionsId { restCountriesUIFabric = 1, restCountriesHtml, fabricListDocExample, scrollablePaneExample }
const DEF_MENU_ID: menuOptionsId = menuOptionsId.restCountriesHtml;

interface IMenuOptions {
  key: menuOptionsId;
  name: string;
  loadCountries: boolean;
  title: string;
}

const menuOptions: IMenuOptions[] = [
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
              <RestCountriesExample />
            }

            {(!this._isMenuActive(menuOptionsId.restCountriesHtml)) ? null :
              <RestCountriesExample
                showAsHtmlTable={true}
              />
            }

          </div>
        </div>
      </div>
    );
  }
}



