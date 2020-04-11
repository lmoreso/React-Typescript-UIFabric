import * as React from 'react';

import { ISimpleListHtmlProps } from './ISimpleListHtmlProps';
import { ISimpleListCol } from './SimpleListCommon';

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
      return (
        <div >
          <this._renderHeader />
          <table>
            <thead>
              <tr key={'-1'}>
                {this.props.columns.map((aColumn: ISimpleListCol, indice: number) => {
                  return (
                    <th key={`-1_${indice.toString()}`} >{aColumn.title}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {this.state.datos.map((dato: any) => {
                return (
                  <tr key={dato.key}>
                    {this.props.columns.map((aColumn: ISimpleListCol, indice: number) => {
                      if (aColumn.fieldUrl) {
                        return (
                          <td key={`${dato.key}_${indice.toString()}`}>
                            <a href={dato[aColumn.fieldUrl]} target="_blank">
                              <span title={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.fieldUrl]}>
                                {Array.isArray(dato[aColumn.field]) ? dato[aColumn.field].join(', ') : dato[aColumn.field]}
                              </span>
                            </a>
                          </td>
                        );
                      } else if (aColumn.isImage) {
                        return (
                          <td key={`${dato.key}_${indice.toString()}`} >
                            <img src={dato[aColumn.field]} width={aColumn.width * 3} alt={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.field]}/>
                          </td>
                        );
                      } else {
                        return (
                          <td key={`${dato.key}_${indice.toString()}`}>
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
