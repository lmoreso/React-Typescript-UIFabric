import * as React from 'react';

import { ISimpleListHtmlProps } from './ISimpleListHtmlProps';
import { ISimpleListCol, SimpleList, ALL_ITEMS_GROUPED_KEY, filterByTextActions, filterByTextActionLabel, filterByTextActionsLabels } from './ISimpleListLib';
import './SimpleListHtml.css';

const BACKGROUND_COLOR_DEF = 'DimGray';

interface ISimpleListHtmlStates {
  dataFiltered: any[];
  filterText: string;
  filterGroupedText: string;
  isCompactMode: boolean;
  numItemsFilteredByText: number;
  filterByGroupField: string;
  filterByTextField: string;
  filterByTextAction: filterByTextActions;
  requireFilterText: boolean;
}

export class SimpleListHtml extends React.Component<ISimpleListHtmlProps, ISimpleListHtmlStates> {
  private _simpleList: SimpleList;

  public constructor(props: ISimpleListHtmlProps) {
    super(props);


    this._simpleList = new SimpleList(props);
    // this._listStates = this._simpleList.filterByText('z', this._listStates);
    this._simpleList.filterByGroup('Oceania');
    this._simpleList.orderByColumn('6');
    this.state = {
      dataFiltered: this._simpleList.state.dataFiltered,
      filterText: this._simpleList.state.filterText,
      filterGroupedText: this._simpleList.state.filterGroupedText,
      isCompactMode: (this.props.listCompactMode) ? true : false,
      numItemsFilteredByText: this._simpleList.state.numItemsFilteredByText,
      filterByGroupField: (this._simpleList.state.groupableFields.length > 0) ? this._simpleList.state.groupableFields[0].field : '',
      filterByTextField: (this._simpleList.state.filterableFields.length > 0) ? this._simpleList.state.filterableFields[0].field : '',
      filterByTextAction: this._simpleList.state.filterByTextAction,
      requireFilterText: this._simpleList.state.requireFilterText,
    }

    this._renderHeader = this._renderHeader.bind(this);
    this._onChangeFilterText = this._onChangeFilterText.bind(this);
    this._onChangeGroupText = this._onChangeGroupText.bind(this);
    this._onChangeCheckBoxCompactMode = this._onChangeCheckBoxCompactMode.bind(this);
    this._onClickHeaderColumn = this._onClickHeaderColumn.bind(this);
    this._onChangeGroupField = this._onChangeGroupField.bind(this);
    this._onChangeFilterByTextField = this._onChangeFilterByTextField.bind(this);
    this._onChangeFilterByTextAction = this._onChangeFilterByTextAction.bind(this);
  }

  private _onChangeGroupText(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._simpleList.filterByGroup(event.target.value);
    this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
      filterGroupedText: this._simpleList.state.filterGroupedText,
    });
  }

  private _onChangeGroupField(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({
      filterByGroupField: event.target.value,
    });
  }

  private _onChangeFilterByTextAction(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._filterByText(this.state.filterText, event.target.value as filterByTextActions, this.state.filterByTextField);
  }

  private _onChangeFilterByTextField(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._filterByText(this.state.filterText, this.state.filterByTextAction, event.target.value);
  }

  private _filterByText(textFilter: string, filterByTextAction: filterByTextActions, filterByTextField: string): void {
    this._simpleList.filterByText(textFilter, filterByTextAction, filterByTextField);
    this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
      filterText: this._simpleList.state.filterText,
      filterGroupedText: this._simpleList.state.filterGroupedText,
      numItemsFilteredByText: this._simpleList.state.numItemsFilteredByText,
      filterByTextAction: this._simpleList.state.filterByTextAction,
      filterByTextField: this._simpleList.state.filterByTextField,
      requireFilterText: this._simpleList.state.requireFilterText,
    });
  }

  private _onChangeFilterText(event: React.ChangeEvent<HTMLInputElement>): void {
    this._filterByText(event.target.value, this.state.filterByTextAction, this.state.filterByTextField);
  }

  private _onClickHeaderColumn(columnKey: string): void {
    this._simpleList.orderByColumn(columnKey);
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
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

        {/* CheckBox CompactMode */}
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

        {/* Controles de filtro por Texto */}
        {(this._simpleList.state.groupableFields.length <= 0) ? null :
          <label className='Control-styles'>
            {/* Combo de Campos Filtrables */}
            <select style={{ textAlign: 'center' }} className='Control-styles' value={this.state.filterByTextField} onChange={this._onChangeFilterByTextField}>
              {this._simpleList.state.filterableFields.map((aField: ISimpleListCol, index) => {
                return (
                  <option key={index} value={aField.field}>
                    {`${aField.title}`}
                  </option>
                )
              })}
            </select>

            {/* Combo de operación de filtro */}
            <select style={{ textAlign: 'center' }} className='Control-styles' value={this.state.filterByTextAction} onChange={this._onChangeFilterByTextAction}>
              {filterByTextActionsLabels.map((anAction: filterByTextActionLabel, index) => {
                return (
                  <option key={index} value={anAction.action} style={{ textAlign: 'center' }}>
                    {`${anAction.title}`}
                  </option>
                )
              })}
            </select>
            
            {/* Texto a filtrar */}
            <input disabled={!this.state.requireFilterText} className='Control-styles' type="text" value={this.state.filterText} onChange={this._onChangeFilterText} />
          </label>
        }


        {/* Combos de filtro por Grupos */}
        {(this._simpleList.state.groupableFields.length <= 0) ? null :
          <label className='Control-styles'>
            {/* Combo de Campos Agrupables */}
            <select style={{ textAlign: 'center' }} className='Control-styles' value={this.state.filterByGroupField} onChange={this._onChangeGroupField}>
              {this._simpleList.state.groupableFields.map((aField: ISimpleListCol, index) => {
                return (
                  <option key={index} value={aField.field}>
                    {`Filtrar por ${aField.title}`}
                  </option>
                )
              })}
            </select>

            {/* Combo del Grupo Activo */}
            <select style={{ textAlign: 'center' }} className='Control-styles' value={this.state.filterGroupedText} onChange={this._onChangeGroupText}>
              <option key={ALL_ITEMS_GROUPED_KEY} value={(this.props.fieldsDropdownFilter) ? this.props.fieldsDropdownFilter.valueNoFilter : undefined}>
                {`${this.props.fieldsDropdownFilter!.valueNoFilter} (${this.state.numItemsFilteredByText} ${this.props.labelItems})`}
              </option>
              {this._simpleList.state.groupedItems.map((aGroup, index) => {
                return (
                  <option key={index} value={aGroup.value}>
                    {`${aGroup.value} (${aGroup.numOcurrences} ${this.props.labelItems})`}
                  </option>
                )
              })}
            </select>
          </label>

        }

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
                    if (aColumn.canSortAndFilter && aColumn.isSorted) {
                      iconOrder = (aColumn.isSortedDescending) ? String.fromCharCode(8595) : String.fromCharCode(8593);
                    }
                    let styleCH = { ...styleCellHeader };
                    styleCH.width = aColumn.width;
                    return (
                      <th
                        onClick={(!aColumn.canSortAndFilter) ? undefined : (event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => {
                          this._onClickHeaderColumn(aColumn.key!);
                        }}
                        style={styleCH} className='Table-header-cell'
                        // key={`-1_${indice.toString()}`}
                        key={aColumn.key}
                        title={(!aColumn.canSortAndFilter) ?
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
