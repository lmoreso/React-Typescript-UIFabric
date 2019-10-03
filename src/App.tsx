import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import { initializeIcons } from '@uifabric/icons';
import { GetRestExample } from './MainVista';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

interface IAppStates {

}

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, Typescript & Fabric UI</h1>
        </header>
        <Fabric>
            <div>
              <GetRestExample />
            </div>
        </Fabric>
      </div>
    );
  }
}

export default App;
