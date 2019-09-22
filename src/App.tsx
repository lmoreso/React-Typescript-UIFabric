import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { initializeIcons } from '@uifabric/icons';
import { GetRestExample } from './VRest';


enum opciones { nada, rest };
interface IAppStates {
  opcion: opciones;
}

class App extends React.Component<{}, IAppStates> {
  public constructor(props: any) {
    super(props);
    // @uifabric/icons: Register icons and pull the fonts from the default SharePoint CDN:
    initializeIcons();
    this.state = { opcion: opciones.nada }
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, Benvinguts!</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <DefaultButton
          text='Proves Rest'
          primary={true}
          //href='https://developer.microsoft.com/en-us/fabric#/components/button'
          onClick={(event) => {
            (this.state.opcion == opciones.rest) ? this.setState({ opcion: opciones.nada }) : this.setState({ opcion: opciones.rest });
            // GetRestEjemplo();
          }}
        />
        {(this.state.opcion == opciones.nada) ?
          <div>
            <h5>Ninguna opción activada</h5>
          </div>
          :
          <div>
            <h5>Opción Rest activada</h5>
            <GetRestExample/>
          </div>
        }
      </div>
    );
  }
}

export default App;
