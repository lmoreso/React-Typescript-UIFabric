import * as React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import { MainView } from './MainView';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

// La primera opció no funciona en producció si la aplicació no està al arrel.
// import logo from './logo.svg';
let logo = window.location.origin + window.location.pathname + 'img/logo.svg'; // Tiene que estar en la carpeta public.

interface IAppStates {

}

const REACT_URL = 'https://reactjs.org/';
const TYPESCRIPT_URL = 'https://www.typescriptlang.org/docs/home.html';
const FLUENT_UI_URL = 'https://developer.microsoft.com/en-us/fluentui#/controls/web';
const UI_FABRIC_URL = 'https://developer.microsoft.com/en-us/office/blogs/ui-fabric-is-evolving-into-fluent-ui';

class App extends React.Component<{}, IAppStates> {
  // private _labelId = useId('labelElement');

  public constructor(props: any) {
    super(props);
    // @uifabric/icons: Register icons and pull the fonts from the default SharePoint CDN:
    initializeIcons();
  }

  public render() {
    return (
      <div className="App">
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
            <div>
              <MainView />
            </div>
          </ScrollablePane>
        </Fabric>
      </div>
    );
  }
}

export default App;
