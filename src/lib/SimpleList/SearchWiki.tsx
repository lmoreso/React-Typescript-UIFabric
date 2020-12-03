import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image } from 'office-ui-fabric-react/lib/Image';

export interface ISearchWikiProps {
  rootUrl: string;
  textToSearch: string;
  width: number;
  enDesarrollo?: boolean;
}

enum fetchResults { loading, loadedOk, loadedErr }

export interface ISearchWikiStates {
  fetchResult: fetchResults;
  imageLoaded: boolean;
}

export class SearchWiki extends React.Component<ISearchWikiProps, ISearchWikiStates> {
  private _data: any;
  private _txtError: string;

  public constructor(props: ISearchWikiProps) {
    super(props);

    this.state = {
      fetchResult: fetchResults.loading,
      imageLoaded: false,
    }

    // this._renderHeader = this._renderHeader.bind(this);
  }

  public componentDidMount() {
    // Descargar el HTML del artículo
    let url = `${this.props.rootUrl}/w/api.php?action=query&titles=${this.props.textToSearch}&prop=extracts|pageimages&exchars=1200&format=json&exintro=&pithumbsize=500&origin=*`;
    console.log('URL', url);
    fetch(url)
      .then((res: Response) => {
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

  public render(): JSX.Element {
    if (this.state.fetchResult === fetchResults.loadedErr) {
      return (
        <div style={{ width: `${this.props.width}px` }}>
          <Label>{'ERROR'}</Label>
          <Label>{this._txtError}</Label>
        </div>
      )
    } else if (this.state.fetchResult === fetchResults.loading) {
      return (
        <div style={{ width: `${this.props.width}px` }}>
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
      let imagen = this._data.query.pages[pageId].thumbnail.source;
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          <div style={{ width: `${this.props.width}px`, display: 'flex', justifyContent: 'center', flexDirection: 'row', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black' }} >
            <div style={{width: `50%`}}>
              <Label style={{ fontSize: 'large', fontWeight: 'lighter' }}>{titulo}</Label>
              <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: html }} />
              <Link href={enlace} target='_blank'>Saber mas ...</Link>
            </div>
            <Image
              src={imagen}
            // width={aSlColumn.width}
            />
          </div>

          {(!this.props.enDesarrollo) ? null :
            <div>
              <Label >{JSON.stringify(this._data)}</Label>
            </div>
          }
        </div>
      )
    }


  }

}
