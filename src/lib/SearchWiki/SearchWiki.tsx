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
        <Label style={{ fontSize: 'medium', fontWeight: 'lighter' }} >{props.titulo}</Label>
      )
    else
      return (
        <Stack horizontal horizontalAlign='space-between' verticalAlign='center'>
          <IconButton
            hidden={true}
            iconProps={{ iconName: 'ChevronLeft' }}
            onClick={(ev) => { this.onChangePage(this.state.pageIndex! - 1) }}
          />
          <Label style={{ fontSize: 'medium', fontWeight: 'lighter' }} >{props.titulo}</Label>
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
      // Determinar orientación
      let thePage = this._wikiRes.extractPages![this.state.pageIndex!];
      let htmlOrText = thePage.textOrHtml;
      let titulo = thePage.title;
      let enlace = thePage.link;
      let imagenUrl = (thePage.image) ? thePage.image.url : undefined;
      let imagenWidth = (thePage.image) ? thePage.image.width : undefined;
      let imagenHeight = (thePage.image) ? thePage.image.height : undefined;
      let aspectRatio = (thePage.image) ? imagenWidth! / imagenHeight! : 0;
      let landscape = false;
      if (this.props.panelOrientation === panelOrientations.landscape)
        landscape = true;
      else if (this.props.panelOrientation === panelOrientations.auto && (imagenWidth) && (imagenHeight) && imagenHeight > imagenWidth) {
        landscape = true;
      }

      // Estilos para Depuración
      let divsBorder: string | undefined = (this.props.enDesarrollo) ? '1px solid red' : undefined;

      // Estilos según orientación
      const divRootPadding: number = 2;
      const divMargin: number = 2;
      let divImagenWidth: number;
      let divTextWidth: number;

      let divRootCSS: React.CSSProperties = {
        overflow: 'hidden',
        ...this.props.rootStyle,
        padding: divRootPadding,
      }

      let divImageCSS: React.CSSProperties = {
        margin: `${divMargin}px`,
        overflow: 'hidden',
        border: divsBorder,
      }

      let divTextCSS: React.CSSProperties = {
        margin: `${divMargin}px`,
        border: divsBorder,
      }

      if (landscape) {
        divImagenWidth = (aspectRatio) ? Math.round(this.props.fixedSize * aspectRatio! - divMargin * 2) : 0;
        // divTextWidth = Math.round((this.props.fixedSize - divMargin * 2) * ((aspectRatio) ? aspectRatio : 1));
        divTextWidth = this.props.fixedSize - divMargin * 2;

        divRootCSS.maxWidth = `${this.props.fixedSize * 3}px`;
        divImageCSS.height = `${this.props.fixedSize}px`
      } else {
        divTextWidth = this.props.fixedSize - divMargin * 2 - divRootPadding * 2 - 2;
        divImagenWidth = (aspectRatio) ? divTextWidth : 0;

        divRootCSS.width = `${this.props.fixedSize}px`;
        divImageCSS.maxHeight = `${this.props.fixedSize}px`
      }
      divImageCSS.width = `${divImagenWidth}px`
      divTextCSS.width = `${divTextWidth}px`

      return (
        <Stack horizontal={!landscape} >
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
