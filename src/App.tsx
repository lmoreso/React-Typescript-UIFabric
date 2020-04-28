import * as React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import { MainView } from './MainView';


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
              <MainView />
      </div>
    );
  }
}

export default App;
