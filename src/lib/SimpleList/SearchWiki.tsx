import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image } from 'office-ui-fabric-react/lib/Image';

export enum panelOrientations { landscape, portrait, auto }

export interface ISearchWikiProps {
  rootUrl: string;
  textToSearch: string;
  fixedSize: number;
  plainText?: boolean;
  numChars?: number;
  numSentences?: number,
  imageSize?: number,
  enDesarrollo?: boolean;
  panelOrientation?: panelOrientations;
}

enum fetchResults { loading, loadedOk, loadedErr }

export interface ISearchWikiStates {
  fetchResult: fetchResults;
}

export class SearchWiki extends React.Component<ISearchWikiProps, ISearchWikiStates> {
  private _data: any;
  private _txtError: string;
  private _queryUrl: string;

  public constructor(props: ISearchWikiProps) {
    super(props);

    this.state = {
      fetchResult: fetchResults.loading,
    }

    // this._renderHeader = this._renderHeader.bind(this);
  }

  private _searchWiki() {
    if (this.props.textToSearch && this.props.textToSearch.length > 0) {
      this.setState({ fetchResult: fetchResults.loading })
      // Componer la query
      this._queryUrl = `${this.props.rootUrl}/w/api.php?action=query&titles=${this.props.textToSearch}&prop=extracts|pageimages&format=json`
      this._queryUrl = this._queryUrl + `&exintro=&pithumbsize=${(this.props.imageSize && this.props.imageSize > 50) ? this.props.imageSize : 250}`
      if (this.props.numChars && this.props.numChars > 0)
        this._queryUrl = this._queryUrl + `&exchars=${this.props.numChars}`;
      else if (this.props.numSentences && this.props.numSentences > 0)
        this._queryUrl = this._queryUrl + `&exsentences=${this.props.numSentences}`;
      if (this.props.plainText) this._queryUrl = this._queryUrl + `&explaintext=`;
      this._queryUrl = this._queryUrl + `&origin=*`;
      // Descargar el HTML del artículo
      fetch(this._queryUrl)
        .then((res: Response) => {
          // console.log('Response', res);
          return (res.json());
        })
        .then((data) => {
          // console.log('JSON parseado', data);
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
    if (this.props.textToSearch !== prevProps.textToSearch
      || this.props.rootUrl !== prevProps.rootUrl
      || this.props.numChars !== prevProps.numChars
      || this.props.plainText !== prevProps.plainText
      || this.props.numSentences !== prevProps.numSentences
      || this.props.imageSize !== prevProps.imageSize
    ) {
      this._searchWiki();
    }
  }

  public render(): JSX.Element {
    if (this.state.fetchResult === fetchResults.loadedErr) {
      return (
        <div style={{ width: `${this.props.fixedSize}px` }}>
          <Label>{'ERROR'}</Label>
          <Label>{this._txtError}</Label>
        </div>
      )
    } else if (this.state.fetchResult === fetchResults.loading) {
      return (
        <div style={{ width: `${this.props.fixedSize}px` }}>
          <Spinner
            size={SpinnerSize.large}
          />
        </div>
      )
    } else {
      let pageId = Object.keys(this._data.query.pages)[0];
      let htmlOrText = this._data.query.pages[pageId].extract;
      let titulo = this._data.query.pages[pageId].title;
      let enlace = `${this.props.rootUrl}/wiki/${this.props.textToSearch}`;
      let imagen = (this._data.query.pages[pageId].thumbnail) ? this._data.query.pages[pageId].thumbnail.source : null;
      let imagenWidth = (this._data.query.pages[pageId].thumbnail) ? this._data.query.pages[pageId].thumbnail.width : null;
      let imagenHeight = (this._data.query.pages[pageId].thumbnail) ? this._data.query.pages[pageId].thumbnail.height : null; 
      // let aspectRatio = imagenWidth / imagenHeight;  
      let landscape = false;
      if (this.props.panelOrientation === panelOrientations.landscape)
        landscape = true;
      else if (this.props.panelOrientation === panelOrientations.auto && (imagenWidth) && (imagenHeight) && imagenHeight > imagenWidth) {
        landscape = true;
      }

      return (
        <div
          style={{
            display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start',
            flexDirection: (landscape) ? 'column' : 'row',
          }}
        >
          <div
            style={{
              padding: '5px',
              // height: (landscape) ? `${this.props.fixedSize}px` : undefined,
              width: (!landscape) ? `${this.props.fixedSize}px` : undefined,
              maxWidth: (landscape) ? `${this.props.fixedSize * 3}px` : undefined,
              display: 'flex', justifyContent: 'flex-start',
              flexDirection: (landscape) ? 'row' : 'column',
              // borderStyle: 'solid', borderWidth: '1px', borderColor: 'black',
            }}
          >
            <div style={{
              maxHeight: (!landscape) ? `${this.props.fixedSize}px` : undefined, 
              // width: (!landscape) ? `${this.props.fixedSize}px` : `${Math.round(this.props.fixedSize * aspectRatio)}px`,
              width: (!landscape) ? `${this.props.fixedSize}px` : `200px`,
              height: (landscape) ? `${this.props.fixedSize}px` : undefined,
              overflow: 'hidden',
              // borderStyle: 'solid', borderWidth: '1px', borderColor: 'black',
            }}
            >
              <Image
                src={imagen}
                height={(landscape) ? '100%' : undefined}
                width={(!landscape) ? '100%' : undefined}
              />
            </div>
            <div style={{
              // margin: '5px',
              // borderStyle: 'solid', borderWidth: '1px', borderColor: 'black',
            }}
            >
              <Label style={{ fontSize: 'large', fontWeight: 'lighter' }}>{titulo}</Label>
              {(this.props.plainText) ?
                <div style={{ textAlign: 'justify' }} >{htmlOrText}</div>
                :
                <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: htmlOrText }} />
              }
              <Link href={enlace} target='_blank'>Saber mas ...</Link>
            </div>
            <div style={{ margin: '10px' }}>
            </div>
          </div>

          {(!this.props.enDesarrollo) ? null :
            <div style={{ alignItems: 'left', textAlign: 'left', marginLeft: '5px', maxWidth: '1024px' }}>
              <a href={this._queryUrl} target='_blank'>{this._queryUrl}</a>
              <pre id="json" style={{ textAlign: 'left' }} >{JSON.stringify(this._data, null, 2)}</pre>
            </div>
          }
        </div>
      )
    }


  }

}
