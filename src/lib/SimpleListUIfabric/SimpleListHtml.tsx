import * as React from 'react';

import { ISimpleListHtmlProps } from './ISimpleListHtmlProps';
import { ISimpleListCol } from './ISimpleListProps';
import './SimpleListHtml.css';

const BACKGROUND_COLOR_DEF = 'DimGray';

interface ISimpleListHtmlStates {
  datos: any[];
}

export class SimpleListHtml extends React.Component<ISimpleListHtmlProps, ISimpleListHtmlStates> {
  private _allItems: any[];

  public constructor(props: ISimpleListHtmlProps) {
    super(props);
    this._allItems = this.props.data.slice(0);

    this._renderHeader = this._renderHeader.bind(this);

    this.state = {
      datos: this._allItems,
    }
  }


  private _renderHeader(): JSX.Element {
    return (
      <div>
      </div>
    );
  }

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      let styleCellHeader: React.CSSProperties = {};
      let styleCell: React.CSSProperties = {};

      styleCellHeader.backgroundColor = (this.props.backgroundColorHeader)? this.props.backgroundColorHeader : BACKGROUND_COLOR_DEF;
      
      if (!this.props.listCompactMode) {
        styleCell.borderBottomColor = styleCellHeader.backgroundColor;
        styleCell.borderBottomStyle = "solid";
        styleCell.borderBottomWidth = "1px"
        styleCell.padding = "4px";
      }
 /* border-bottom-style: solid;
  border-bottom-color: lightsteelblue;
  border-bottom-width: 1px; */
      return (
        <div >
          <this._renderHeader />
          <table>
            <thead>
              <tr className='Table-header' key={'-1'}>
                {this.props.columns.map((aColumn: ISimpleListCol, indice: number) => {
                  let styleCH = {... styleCellHeader};
                  styleCH.width = aColumn.width;
                  return (
                    <th style={styleCH} className='Table-header-cell' key={`-1_${indice.toString()}`}> {aColumn.title} </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {this.state.datos.map((dato: any) => {
                return (
                  <tr key={dato.key} className='Table-row'>
                    {this.props.columns.map((aColumn: ISimpleListCol, indice: number) => {
                      if (aColumn.fieldUrl) {
                        return (
                          <td key={`${dato.key}_${indice.toString()}`} className='Table-cell' style={styleCell}>
                            <a href={dato[aColumn.fieldUrl]} target="_blank">
                              <span title={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.fieldUrl]}>
                                {Array.isArray(dato[aColumn.field]) ? dato[aColumn.field].join(', ') : dato[aColumn.field]}
                              </span>
                            </a>
                          </td>
                        );
                      } else if (aColumn.isImage) {
                        return (
                          <td key={`${dato.key}_${indice.toString()}`} className='Table-cell' style={styleCell} >
                            <img src={dato[aColumn.field]} width={aColumn.width} alt={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.field]}/>
                          </td>
                        );
                      } else {
                        return (
                          <td key={`${dato.key}_${indice.toString()}`} className='Table-cell' style={styleCell} >
                            <span title={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : ''}>
                              {Array.isArray(dato[aColumn.field]) ? dato[aColumn.field].join(', ') : dato[aColumn.field]}
                            </span>
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
}
