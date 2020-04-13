import * as React from 'react';

import { ISimpleListHtmlProps } from './ISimpleListHtmlProps';
import { ISimpleListCol, ISimpleListStates, SimpleList } from './ISimpleListLib';
import './SimpleListHtml.css';

const BACKGROUND_COLOR_DEF = 'DimGray';

interface ISimpleListHtmlStates {
  dataFiltered: any[];
  filterText: string;
  filterGroupedItem: string;
}

export class SimpleListHtml extends React.Component<ISimpleListHtmlProps, ISimpleListHtmlStates> {
  private _listStates: ISimpleListStates;
  private _simpleList: SimpleList;

  public constructor(props: ISimpleListHtmlProps) {
    super(props);


    this._simpleList = new SimpleList(props);
    this._listStates = this._simpleList.initState(this._listStates);
    // this._listStates = this._simpleList.filterByText('z', this._listStates);
    this._listStates = this._simpleList.filterByGroup('Asia', this._listStates);

    this.state = {
      dataFiltered: this._listStates.dataFiltered,
      filterText: this._listStates.filterText,
      filterGroupedItem: this._listStates.filterGroupedItem,
    }

    this._renderHeader = this._renderHeader.bind(this);
    this._onChangeFilterText = this._onChangeFilterText.bind(this);
    this._onChangeGroupText = this._onChangeGroupText.bind(this);
  }

  private _onChangeGroupText(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._listStates = this._simpleList.filterByGroup(event.target.value, this._listStates);
    this.setState({
      dataFiltered: this._listStates.dataFiltered,
      filterGroupedItem: this._listStates.filterGroupedItem,
    });
  }

  private _onChangeFilterText(event: React.ChangeEvent<HTMLInputElement>): void {
    this._listStates = this._simpleList.filterByText(event.target.value, this._listStates);
    this.setState({
      dataFiltered: this._listStates.dataFiltered,
      filterText: this._listStates.filterText,
      filterGroupedItem: this._listStates.filterGroupedItem,
    });
  }

  private _renderHeader(): JSX.Element {
    // console.log(this._listStates);
    return (
      <div>
        <p>{`Filtro Texto Activo: '${this._listStates.filterText}'`}</p>
        <p>{`Se han encontrado ${this._listStates.groupedItems.length} Grupos:`}</p>
        {this._listStates.groupedItems.map(aGroup => { return (<span>{`${aGroup.value} (${aGroup.numOcurrences}) - `}</span>) })}
        <p>{`Filtro Grupo Activo: '${this._listStates.filterGroupedItem}'`}</p>
        <p>{`Nº de paises encontrados: ${this._listStates.dataFiltered.length}`}</p>
        <label>
          Filtrar:
          <input type="text" value={this.state.filterText} onChange={this._onChangeFilterText} />
        </label>
        <label>
          Pick your favorite flavor:
          <select value={this.state.filterGroupedItem} onChange={this._onChangeGroupText}>
            <option value={ (this.props.fieldDropdownFilter) ? this.props.fieldDropdownFilter.valueNoFilter : undefined}>
              {`${this.props.fieldDropdownFilter!.valueNoFilter} (${this.state.dataFiltered.length} ${this.props.labelItems})`}
            </option>
            {this._listStates.groupedItems.map(aGroup => {
              return (<option value={aGroup.value}>{`${aGroup.value} (${aGroup.numOcurrences} ${this.props.labelItems})`}</option>)
            })}
          </select>
        </label>
      </div>
    );
  }

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      let styleCellHeader: React.CSSProperties = {};
      let styleCell: React.CSSProperties = {};

      styleCellHeader.backgroundColor = (this.props.backgroundColorHeader) ? this.props.backgroundColorHeader : BACKGROUND_COLOR_DEF;

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
                  let styleCH = { ...styleCellHeader };
                  styleCH.width = aColumn.width;
                  return (
                    <th style={styleCH} className='Table-header-cell' key={`-1_${indice.toString()}`}> {aColumn.title} </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {this.state.dataFiltered.map((dato: any) => {
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
                            <img src={dato[aColumn.field]} width={aColumn.width} alt={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.field]} />
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
