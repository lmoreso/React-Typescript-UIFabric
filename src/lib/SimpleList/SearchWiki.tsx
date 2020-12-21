import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export enum panelOrientations { landscape, portrait, auto }

export interface ISearchWikiProps {
  rootUrl: string;
  textToSearch: string;
  numItemsToSearch?: number;
  fixedSize: number;
  plainText?: boolean;
  numChars?: number;
  numSentences?: number,
  imageSize?: number,
  enDesarrollo?: boolean;
  panelOrientation?: panelOrientations;
  rootStyle?: React.CSSProperties;
}

interface ISearchWikiResult {
  pageId: string;
  index: number;
  textOrHtml: string;
  title: string;
  link: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
}

enum fetchResults { loading, loadedOk, loadedErr }

export interface ISearchWikiStates {
  fetchResult: fetchResults;
  numPages: number;
  pageIndex?: number;
}

export class SearchWiki extends React.Component<ISearchWikiProps, ISearchWikiStates> {
  private _data: any;
  private _pages: Array<ISearchWikiResult>;
  private _txtError: string;
  private _queryUrl: string;

  public constructor(props: ISearchWikiProps) {
    super(props);

    this.state = {
      fetchResult: fetchResults.loading,
      numPages: 0,
    }

    this.onChangePage = this.onChangePage.bind(this);
    this._renderTitle = this._renderTitle.bind(this);
    // this._renderTitle = this._renderTitle.bind(this);
  }

  private _searchWiki() {
    if (this.props.textToSearch && this.props.textToSearch.length > 0) {
      this.setState({ fetchResult: fetchResults.loading })
      // Componer la query
      this._queryUrl = `${this.props.rootUrl}/w/api.php?action=query&generator=search`;
      this._queryUrl = this._queryUrl + `&gsrlimit=${(this.props.numItemsToSearch) ? this.props.numItemsToSearch : 1}`;
      this._queryUrl = this._queryUrl + `&gsrsearch=${this.props.textToSearch}`;
      this._queryUrl = this._queryUrl + `&prop=extracts|pageimages&format=json`
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
          let pages = Object.keys(this._data.query.pages);
          let thePages = new Array<ISearchWikiResult>();
          pages.forEach((aPage, index) => {
            let thePage: ISearchWikiResult = {
              pageId: aPage,
              textOrHtml: this._data.query.pages[aPage].extract,
              title: this._data.query.pages[aPage].title,
              link: `${this.props.rootUrl}/wiki/${this._data.query.pages[aPage].title}`,
              index: this._data.query.pages[aPage].index,
              image: (!this._data.query.pages[aPage].thumbnail) ? undefined :
                {
                  url: this._data.query.pages[aPage].thumbnail.source,
                  height: this._data.query.pages[aPage].thumbnail.height,
                  width: this._data.query.pages[aPage].thumbnail.width,
                }
            }
            thePages.push(thePage);
          });
          this._pages = thePages.sort((a, b) => (a.index > b.index) ? 1 : 0);
          // console.log(thePages);
          this.setState({
            fetchResult: fetchResults.loadedOk,
            numPages: this._pages.length,
            pageIndex: 0,
          })
        })
        .catch((error) => {
          console.log(error);
          this._txtError = error.toString();
          this.setState({ fetchResult: fetchResults.loadedErr, numPages: 0, pageIndex: undefined })
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
      || this.props.numItemsToSearch !== prevProps.numItemsToSearch
    ) {
      this._searchWiki();
    }
  }

  private onChangePage(newValue: any): void {
    let newIndex = Number(newValue);
    newIndex = (newIndex || newIndex == 0) ?
      (newIndex >= this.state.numPages) ?
        0
        :
        (newIndex < 0) ?
          this.state.numPages
          :
          newIndex
      :
      0;
    this.setState({ pageIndex: newIndex})
  }

  private _renderTitle(props: { titulo: string; hidden?: boolean; numPages?: number }): JSX.Element {
    if (props.hidden)
      return (
        <span></span>
      )
    else if (!props.numPages || props.numPages <= 1)
      return (
        <Label style={{ fontSize: 'large', fontWeight: 'lighter' }} >{props.titulo}</Label>
      )
    else
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            hidden={true}
            iconProps={{ iconName: 'ChevronLeft' }}
            onClick={(ev) => { this.onChangePage(this.state.pageIndex! - 1) }}
          />
          <Label style={{ fontSize: 'large', fontWeight: 'lighter' }} >{props.titulo}</Label>
          <IconButton
            hidden={false}
            iconProps={{ iconName: 'ChevronRight' }}
            onClick={(ev) => { this.onChangePage(this.state.pageIndex! + 1) }}
          />
        </div>
      );
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
      let thePage = this._pages[this.state.pageIndex!];
      let htmlOrText = thePage.textOrHtml;
      let titulo = thePage.title;
      let enlace = thePage.link;
      let imagenUrl = (thePage.image) ? thePage.image.url : undefined;
      let imagenWidth = (thePage.image) ? thePage.image.width : undefined;
      let imagenHeight = (thePage.image) ? thePage.image.height : undefined;
      let aspectRatio = (thePage.image) ? imagenWidth! / imagenHeight! : undefined;
      let landscape = false;
      if (this.props.panelOrientation === panelOrientations.landscape)
        landscape = true;
      else if (this.props.panelOrientation === panelOrientations.auto && (imagenWidth) && (imagenHeight) && imagenHeight > imagenWidth) {
        landscape = true;
      }
      // Estilos según orientación
      const divRootPadding: number = 2;
      const divMargin: number = 2;
      let divRootWidth: number | undefined = this.props.fixedSize;
      let divImagenWidth: number = (aspectRatio) ? divRootWidth - divMargin * 2 : 0;
      let divTextWidth: number = divImagenWidth;
      let divRootMaxWidth: number | undefined = undefined;

      if (landscape) {
        divTextWidth = this.props.fixedSize - divMargin * 2
        divImagenWidth = (aspectRatio) ? Math.round(this.props.fixedSize * aspectRatio! - divMargin * 2) : 0;
        divRootWidth = undefined;
        divRootMaxWidth = this.props.fixedSize * 3;
      }

      // Estilos para Depuración
      let divImagenBorder: string | undefined = undefined;
      let divTextBorder: string | undefined = undefined;
      if (this.props.enDesarrollo) {
        divImagenBorder = '1px solid red';
        divTextBorder = '1px solid blue';
      }

      let divRootCSS: React.CSSProperties = {
        display: 'flex', justifyContent: 'flex-start', flexDirection: (landscape) ? 'row' : 'column',
        padding: (divRootPadding) ? `${divRootPadding}px` : undefined,
        width: (divRootWidth) ? `${divRootWidth}px` : undefined,
        maxWidth: (divRootMaxWidth) ? `${divRootMaxWidth}px` : undefined,
        overflow: 'hidden',
        ...this.props.rootStyle,
      }

      let divImageCSS: React.CSSProperties = (aspectRatio) ?
        {
          maxHeight: (!landscape) ? `${this.props.fixedSize}px` : undefined,
          width: divImagenWidth,
          margin: '2px',
          height: (landscape) ? `${this.props.fixedSize}px` : undefined,
          overflow: 'hidden',
          border: divImagenBorder,
        }
        :
        {
          width: 0,
          height: 0,
        }

      let divTextCSS: React.CSSProperties = {
        margin: '2px',
        width: (divTextWidth) ? `${divTextWidth}px` : undefined,
        border: divTextBorder,
      }

      return (
        <div
          style={{
            display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start',
            flexDirection: (landscape) ? 'column' : 'row',
          }}
        >
          <div style={divRootCSS} >
            <this._renderTitle titulo={titulo} hidden={landscape} numPages={this.state.numPages}/>
            <div style={divImageCSS}>
              <Image
                src={imagenUrl}
                height={(landscape) ? '100%' : undefined}
                width={(!landscape) ? '100%' : undefined}
              />
            </div>
            <div style={divTextCSS} >
              <this._renderTitle titulo={titulo} hidden={!landscape} numPages={this.state.numPages}/>
              {(this.props.plainText) ?
                <div style={{ textAlign: 'justify' }} >{htmlOrText}</div>
                :
                <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: htmlOrText }} />
              }
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginTop: '2px',
                }}
              >
                <Link href={enlace} target='_blank'>Saber mas ...</Link>
              </div>
            </div>
            <div style={{ margin: (landscape) ? undefined : '10px' }}>
            </div>
          </div>

          {(!this.props.enDesarrollo) ? null :
            <div style={{ alignItems: 'left', textAlign: 'left', marginLeft: '5px', maxWidth: '1024px' }}>
              <a href={this._queryUrl} target='_blank'>{this._queryUrl}</a>
              <pre id="json" style={{ textAlign: 'left' }} >{JSON.stringify(this.props, null, 2)}</pre>
              <pre id="json" style={{ textAlign: 'left' }} >{JSON.stringify(this._data, null, 2)}</pre>
            </div>
          }
        </div>
      )
    }


  }

}
