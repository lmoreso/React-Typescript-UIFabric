import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image } from 'office-ui-fabric-react/lib/Image';

export interface ISearchWikiProps {
  rootUrl: string;
  textToSearch: string;
  maxWidth: number;
  numChars?: number;
  enDesarrollo?: boolean;
}

enum fetchResults { loading, loadedOk, loadedErr }

export interface ISearchWikiStates {
  fetchResult: fetchResults;
}

export class SearchWiki extends React.Component<ISearchWikiProps, ISearchWikiStates> {
  private _data: any;
  private _txtError: string;

  public constructor(props: ISearchWikiProps) {
    super(props);

    this.state = {
      fetchResult: fetchResults.loading,
    }

    // this._renderHeader = this._renderHeader.bind(this);
  }

  private _searchWiki () {
    if (this.props.textToSearch && this.props.textToSearch.length > 0) {
      this.setState({ fetchResult: fetchResults.loading })
      // Descargar el HTML del artículo
      // Nº de caracteres a descargar (max. 1200)
      let numChars = (!this.props.numChars || this.props.numChars < 100 || this.props.numChars > 1200) ? 1200 : this.props.numChars;
      let url = `${this.props.rootUrl}/w/api.php?action=query&titles=${this.props.textToSearch}&prop=extracts|pageimages&exchars=${numChars}&format=json&exintro=&pithumbsize=500&origin=*`;
      console.log('URL', url);
      fetch(url)
        .then((res: Response) => {
          // console.log('Response', res);
          return (res.json());
        })
        .then((data) => {
          console.log('JSON parseado', data);
          this._data = data;
          this.setState({ fetchResult: fetchResults.loadedOk })
        })
        .catch((error) => {
          console.log(error);
          this._txtError = error.toString();
          this.setState({ fetchResult: fetchResults.loadedErr })
        });
      }
  }

  public componentDidMount() {
    this._searchWiki();
  }

  public componentDidUpdate(prevProps: ISearchWikiProps) {
    if (this.props.textToSearch !== prevProps.textToSearch || this.props.rootUrl !== prevProps.rootUrl
      || this.props.numChars !== prevProps.numChars) {
      this._searchWiki();     
    }
  }

  public render(): JSX.Element {
    if (this.state.fetchResult === fetchResults.loadedErr) {
      return (
        <div style={{ width: `${this.props.maxWidth}px` }}>
          <Label>{'ERROR'}</Label>
          <Label>{this._txtError}</Label>
        </div>
      )
    } else if (this.state.fetchResult === fetchResults.loading) {
      return (
        <div style={{ width: `${this.props.maxWidth}px` }}>
          <Spinner
            size={SpinnerSize.large}
          />
        </div>
      )
    } else {
      let pageId = Object.keys(this._data.query.pages)[0];
      let html = this._data.query.pages[pageId].extract;
      let titulo = this._data.query.pages[pageId].title;
      let enlace = `${this.props.rootUrl}/wiki/${this.props.textToSearch}`;
      let imagen = (this._data.query.pages[pageId].thumbnail)? this._data.query.pages[pageId].thumbnail.source : null;
      // let landscape = false;
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <div style={{ padding: '5px', width: `${this.props.maxWidth}px`, display: 'flex', justifyContent: 'center', flexDirection: 'column', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black' }} >
            <Label style={{ fontSize: 'large', fontWeight: 'lighter' }}>{titulo}</Label>
            <div style={{ margin: '5px' }}>
              <Image
                src={imagen}
                width={'100%'}
              />
            </div>
            <div style={{ margin: '5px' }}>
              <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: html }} />
              <Link href={enlace} target='_blank'>Saber mas ...</Link>
            </div>
          </div>

          {(!this.props.enDesarrollo) ? null :
            <div>
              <pre id="json" style={{ textAlign: 'left' }} >{JSON.stringify(this._data, null, 2)}</pre>
              {/* <Label >{JSON.stringify(this._data, null, 2)}</Label> */}
              {/* <Label >{this._data.toString()}</Label> */}
            </div>
          }
        </div>
      )
    }


  }

}
