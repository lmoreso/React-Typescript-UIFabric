import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { ExtractWiki, IExtractWikiProps, IWikiExtractResult } from './ExtractWiki';
import { Stack } from 'office-ui-fabric-react';

export enum panelOrientations { landscape, portrait, auto }

export interface ISearchWikiProps extends IExtractWikiProps {
  enDesarrollo?: boolean;
  panelOrientation?: panelOrientations;
  rootStyle?: React.CSSProperties;
  fixedSize: number;
}

enum fetchResults { loading, loadedOk, loadedErr }

export interface ISearchWikiStates {
  fetchResult: fetchResults;
  pageIndex?: number;
}

export class SearchWiki extends React.Component<ISearchWikiProps, ISearchWikiStates> {
  // private _data: any;
  // private _pages: Array<IWikiExtractPage>;
  private _txtError: string;
  // private _queryUrl: string;
  private _wikiRes: IWikiExtractResult;

  public constructor(props: ISearchWikiProps) {
    super(props);

    this.state = {
      fetchResult: fetchResults.loading,
    }

    this.onChangePage = this.onChangePage.bind(this);
    this._renderTitle = this._renderTitle.bind(this);
    // this._renderTitle = this._renderTitle.bind(this);
  }

  private _searchWiki() {
    if (this.props.textToSearch && this.props.textToSearch.length > 0) {
      this.setState({ fetchResult: fetchResults.loading });
      ExtractWiki(this.props)
        .then((res: IWikiExtractResult) => {
          // console.log(res)
          this._wikiRes = res;
          this.setState({ fetchResult: fetchResults.loadedOk, pageIndex: 0, })
        })
        .catch((error) => {
          console.log(error);
          this._txtError = error.toString();
          this.setState({ fetchResult: fetchResults.loadedErr, pageIndex: undefined })
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
      || this.props.numPagesToSearch !== prevProps.numPagesToSearch
    ) {
      this._searchWiki();
    }
  }

  private onChangePage(newValue: any): void {
    let newIndex = Number(newValue);
    newIndex = (newIndex || newIndex == 0) ?
      (newIndex >= this._wikiRes.numPages) ?
        0
        :
        (newIndex < 0) ?
          this._wikiRes.numPages - 1
          :
          newIndex
      :
      0;
    this.setState({ pageIndex: newIndex })
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
        <Stack horizontal horizontalAlign='space-between' verticalAlign='center'>
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
        </Stack>
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
      let thePage = this._wikiRes.extractPages![this.state.pageIndex!];
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
        <Stack horizontal={!landscape} 
          // style={{
          //   display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start',
          //   flexDirection: (landscape) ? 'column' : 'row',
          // }}
        >
          <Stack horizontal={landscape} style={divRootCSS} >
            <this._renderTitle titulo={titulo} hidden={landscape} numPages={this._wikiRes.numPages} />
            <div style={divImageCSS}>
              <Image
                src={imagenUrl}
                height={(landscape) ? '100%' : undefined}
                width={(!landscape) ? '100%' : undefined}
              />
            </div>
            <div style={divTextCSS} >
              <this._renderTitle titulo={titulo} hidden={!landscape} numPages={this._wikiRes.numPages} />
              {(this.props.plainText) ?
                <div style={{ textAlign: 'justify' }} >{htmlOrText}</div>
                :
                <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: htmlOrText }} />
              }
              <Link href={enlace} styles={{ root: { marginTop: '2px' } }} target='_blank'>Saber mas ...</Link>
            </div>
            <div style={{ margin: (landscape) ? undefined : '10px' }}>
            </div>
          </Stack>

          {(!this.props.enDesarrollo) ? null :
            <div style={{ alignItems: 'left', textAlign: 'left', marginLeft: '5px', maxWidth: '1024px' }}>
              <Label>URL</Label>
              <a href={this._wikiRes.queryUrl} target='_blank'>{this._wikiRes.queryUrl}</a>
              <Label>SearchWikiProps</Label>
              <pre id="json" style={{ textAlign: 'left' }} >{JSON.stringify(this.props, null, 2)}</pre>
              {(!this._wikiRes.textError || this._wikiRes.textError.length === 0) ? null :
                <Label>{this._wikiRes.textError}</Label>
              }
              <Label>{`Se han encontrado ${this._wikiRes.numPages} Páginas`}</Label>
              <pre id="json" style={{ textAlign: 'left' }} >{JSON.stringify(this._wikiRes.extractPages, null, 2)}</pre>
            </div>
          }
        </Stack>
      )
    }


  }

}
