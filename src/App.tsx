import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import { initializeIcons } from '@uifabric/icons';
import { MainView } from './MainView';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

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
        <Fabric>
          <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
            <Sticky stickyPosition={StickyPositionType.Header}>
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">Exercices about React, Typescript & UIFabric </span>
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
