import * as React from 'react';

import { ISimpleListHtmlProps } from './ISimpleListHtmlProps';
import { ISimpleListCol, ISimpleListStates, SimpleList, ALL_ITEMS_GROUPED_KEY } from './ISimpleListLib';
import './SimpleListHtml.css';

const BACKGROUND_COLOR_DEF = 'DimGray';

interface ISimpleListHtmlStates {
  dataFiltered: any[];
  filterText: string;
  filterGroupedItem: string;
  isCompactMode: boolean;
  numItemsFilteredByText: number;
}

export class SimpleListHtml extends React.Component<ISimpleListHtmlProps, ISimpleListHtmlStates> {
  private _listStates: ISimpleListStates;
  private _simpleList: SimpleList;

  public constructor(props: ISimpleListHtmlProps) {
    super(props);


    this._simpleList = new SimpleList(props);
    this._listStates = this._simpleList.initState();
    // this._listStates = this._simpleList.filterByText('z', this._listStates);
    this._simpleList.filterByGroup('Oceania', this._listStates);
    this._simpleList.orderByColumn('7', this._listStates.dataFiltered);
    this.state = {
      dataFiltered: this._listStates.dataFiltered,
      filterText: this._listStates.filterText,
      filterGroupedItem: this._listStates.filterGroupedItem,
      isCompactMode: (this.props.listCompactMode) ? true : false,
      numItemsFilteredByText: this._listStates.numItemsFilteredByText,
    }

    this._renderHeader = this._renderHeader.bind(this);
    this._onChangeFilterText = this._onChangeFilterText.bind(this);
    this._onChangeGroupText = this._onChangeGroupText.bind(this);
    this._onChangeCheckBoxCompactMode = this._onChangeCheckBoxCompactMode.bind(this);
    this._onClickHeaderColumn = this._onClickHeaderColumn.bind(this);
  }

  private _onChangeGroupText(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._simpleList.filterByGroup(event.target.value, this._listStates);
    this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._listStates.dataFiltered,
      filterGroupedItem: this._listStates.filterGroupedItem,
    });
  }

  private _onChangeFilterText(event: React.ChangeEvent<HTMLInputElement>): void {
    this._listStates = this._simpleList.filterByText(event.target.value);
    this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._listStates.dataFiltered,
      filterText: this._listStates.filterText,
      filterGroupedItem: this._listStates.filterGroupedItem,
      numItemsFilteredByText: this._listStates.numItemsFilteredByText,
    });
  }

  private _onClickHeaderColumn(columnKey: string): void {
    this._simpleList.orderByColumn(columnKey, this._listStates.dataFiltered);
    this.setState({
      dataFiltered: this._listStates.dataFiltered,
    });
  }

  private _onChangeCheckBoxCompactMode(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      isCompactMode: event.target.checked,
    });
  }

  private _renderHeader(): JSX.Element {
    // console.log(this._listStates);
    return (
      <div className='Control-wrapper' >
        {/* <p>{`Filtro Texto Activo: '${this._listStates.filterText}'`}</p>
        <p>{`Se han encontrado ${this._listStates.groupedItems.length} Grupos:`}</p>
        {this._listStates.groupedItems.map(aGroup => { return (<span>{`${aGroup.value} (${aGroup.numOcurrences}) - `}</span>) })}
        <p>{`Filtro Grupo Activo: '${this._listStates.filterGroupedItem}'`}</p>
        <p>{`Nº de paises encontrados: ${this._listStates.dataFiltered.length}`}</p> */}

        {(!this.props.showToggleCompactMode) ? null :
          <label className='Control-styles'>
            Muestra la lista en modo 'Compacto'
            <input
              name="ToggleCompactMode"
              type="checkbox"
              checked={this.state.isCompactMode}
              onChange={this._onChangeCheckBoxCompactMode}
            />
          </label>
        }
        <label className='Control-styles'>
          Filtrar por Nombre:
          <input className='Control-styles' type="text" value={this.state.filterText} onChange={this._onChangeFilterText} />
        </label>
        <label className='Control-styles'>
          Filtrar por Continente:
          <select className='Control-styles' value={this.state.filterGroupedItem} onChange={this._onChangeGroupText}>
            <option key={ALL_ITEMS_GROUPED_KEY} value={(this.props.fieldsDropdownFilter) ? this.props.fieldsDropdownFilter.valueNoFilter : undefined}>
              {`${this.props.fieldsDropdownFilter!.valueNoFilter} (${this.state.numItemsFilteredByText} ${this.props.labelItems})`}
            </option>
            {this._listStates.groupedItems.map((aGroup, index) => {
              return (
                <option key={index} value={aGroup.value}>
                  {`${aGroup.value} (${aGroup.numOcurrences} ${this.props.labelItems})`}
                </option>
              )
            })}
          </select>
        </label>
        {(!this.props.showLabel) ? null :
          <label className='Control-styles'>
            {`${this.state.dataFiltered.length} ${this.props.labelItems}.`}
          </label>
        }
      </div>
    );
  }

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      let styleCellHeader: React.CSSProperties = {};
      let styleCell: React.CSSProperties = {};
      let styleTableContainer: React.CSSProperties = {};

      styleCellHeader.backgroundColor = (this.props.backgroundColorHeader) ? this.props.backgroundColorHeader : BACKGROUND_COLOR_DEF;

      if (!this.state.isCompactMode) {
        styleCell.borderBottomColor = styleCellHeader.backgroundColor;
        styleCell.borderBottomStyle = "solid";
        styleCell.borderBottomWidth = "1px"
        styleCell.padding = "8px";
      }
      
      styleTableContainer.borderColor = (this.props.backgroundColorHeader) ? this.props.backgroundColorHeader : BACKGROUND_COLOR_DEF;
      styleTableContainer.borderStyle = 'solid';
      styleTableContainer.borderWidth = '1px';

      if (this.props.heightInPx && this.props.heightInPx > 0) {
        let heightInPx = (this.props.heightInPx < 500) ? 500 : this.props.heightInPx;
        styleTableContainer.overflowY = 'scroll';
        styleTableContainer.height = `${heightInPx}px`;
        styleTableContainer.maxHeight = `${heightInPx}px`;
      }
      
      return (
        <div>
          <this._renderHeader />
          <div style={styleTableContainer}>
            <table>
              <thead>
                <tr className='Table-header' key={'-1'}>
                  {this.props.columns.map((aColumn: ISimpleListCol, indice: number) => {
                    let iconOrder: string = '';
                    if (aColumn.canSort && aColumn.isSorted) {
                      iconOrder = (aColumn.isSortedDescending) ? String.fromCharCode(8595) : String.fromCharCode(8593);
                    }
                    let styleCH = { ...styleCellHeader };
                    styleCH.width = aColumn.width;
                    return (
                      <th
                        onClick={(!aColumn.canSort) ? undefined : (event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => {
                          this._onClickHeaderColumn(aColumn.key!);
                        }}
                        style={styleCH} className='Table-header-cell'
                        // key={`-1_${indice.toString()}`}
                        key={aColumn.key}
                        title={(!aColumn.canSort) ?
                          `La columna '${aColumn.title}' no se puede ordenar`
                          :
                          `Clica para ordenar la lista por '${aColumn.title}'`
                        }
                      >
                        {`${aColumn.title}  ${iconOrder}`}
                      </th>
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
        </div>
      );
    }
  }
}
