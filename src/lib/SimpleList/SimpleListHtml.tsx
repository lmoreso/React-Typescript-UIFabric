import * as React from 'react';

import { ISimpleListCol, SimpleList, filterByTextActionsId, filterByTextAction, filterByTextActionsList, IGroupedCol, ISimpleListProps } from './ISimpleListLib';
import './SimpleList.css';
import { strings, languagesSupportedIds } from './loc/SimpleListStrings';
import { Flechas } from './img/SimpleListIconos';
import { ISlStyles, themeGray } from './SimpleListColors';

const simpleListVersion = '0.2.0';
/*
  0.2.0: Se mantiene el órden despues de una operación de filtro.
*/

export const simpleListVersionLabel = `SimpleList V.${simpleListVersion}`;

export interface ISimpleListHtmlProps extends ISimpleListProps {
  hidden: boolean;
  isCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  showLabel?: boolean;
  heightInPx?: number;
  theme?: ISlStyles;
}

interface ISimpleListHtmlStates {
  dataFiltered: any[];
  filterText: string;
  filterGroupedText: string;
  isCompactMode: boolean;
  filterByGroupField: IGroupedCol | undefined;
  filterByTextField: ISimpleListCol | undefined;
  filterByTextAction: filterByTextActionsId;
  requireFilterText: boolean;
  language: languagesSupportedIds;
}

export class SimpleListHtml extends React.Component<ISimpleListHtmlProps, ISimpleListHtmlStates> {
  private _simpleList: SimpleList;
  private _theme: ISlStyles;

  public constructor(props: ISimpleListHtmlProps) {
    super(props);
    this._theme = this.props.theme || themeGray;
    this._simpleList = new SimpleList(props);

    this.state = {
      dataFiltered: this._simpleList.state.dataFiltered,
      filterText: this._simpleList.state.filterText,
      filterGroupedText: this._simpleList.state.filterByGroupText,
      isCompactMode: (this.props.isCompactMode) ? true : false,
      filterByGroupField: (this._simpleList.state.groupableFields.length > 0) ? this._simpleList.state.groupableFields[0] : undefined,
      filterByTextField: (this._simpleList.state.filterableFields.length > 0) ? this._simpleList.state.filterableFields[0] : undefined,
      filterByTextAction: this._simpleList.state.filterByTextActionId,
      requireFilterText: this._simpleList.state.requireFilterText,
      language: this._simpleList.state.language,
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
    // this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
      filterGroupedText: this._simpleList.state.filterByGroupText,
    });
  }

  private _onChangeGroupField(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._simpleList.makeGroupedItemsList(event.target.value);
    if (this._simpleList.state.filterByGroupField)
      this.setState({
        filterByGroupField: this._simpleList.state.filterByGroupField,
        dataFiltered: this._simpleList.state.dataFiltered,
      });
  }

  private _onChangeFilterByTextAction(event: React.ChangeEvent<HTMLSelectElement>): void {
    this._filterByText(this.state.filterText, event.target.value as filterByTextActionsId, this.state.filterByTextField!);
  }

  private _onChangeFilterByTextField(event: React.ChangeEvent<HTMLSelectElement>): void {
    let newFilterByTextField = this._simpleList.state.filterableFields.find(aColumn => (aColumn.field == event.target.value));
    if (newFilterByTextField)
      this._filterByText(this.state.filterText, this.state.filterByTextAction, newFilterByTextField);
  }

  private _filterByText(textFilter: string, filterByTextAction: filterByTextActionsId, filterByTextField: ISimpleListCol): void {
    this._simpleList.filterByText(textFilter, filterByTextAction, filterByTextField);
    // this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
      filterText: this._simpleList.state.filterText,
      filterGroupedText: this._simpleList.state.filterByGroupText,
      filterByTextAction: this._simpleList.state.filterByTextActionId,
      filterByTextField: this._simpleList.state.filterByTextField,
      requireFilterText: this._simpleList.state.requireFilterText,
    });
  }

  private _onChangeFilterText(event: React.ChangeEvent<HTMLInputElement>): void {
    this._filterByText(event.target.value, this.state.filterByTextAction, this.state.filterByTextField!);
  }

  private _onClickHeaderColumn(columnKey: string): void {
    // console.log("_onClickHeaderColumn", "columnKey=", columnKey);

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
    let styleHeaderControlsContainer: React.CSSProperties = {
      color: this._theme.headerControlsContainerColor,
    };

    let styleHeaderContainer: React.CSSProperties = {
      backgroundColor: this._theme.headerContainerBackgroundColor,
    };


    return (
      <div className='Header-container' style={styleHeaderContainer}>

        {/* CheckBox CompactMode */}
        {(!this.props.showToggleCompactMode) ? null :
          <label className='Header-controls-container' style={styleHeaderControlsContainer} >
            {strings.config_CompactMode}
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
          <label className='Header-controls-container' style={styleHeaderControlsContainer} >
            {/* Combo de Campos Filtrables */}
            <select style={{ textAlign: 'center' }} className='Header-controls-combos' value={this.state.filterByTextField!.field} onChange={this._onChangeFilterByTextField}>
              {this._simpleList.state.filterableFields.map((aField: ISimpleListCol, index) => {
                return (
                  <option key={index} value={aField.field}>
                    {`${aField.title}`}
                  </option>
                )
              })}
            </select>

            {/* Combo de operación de filtro */}
            <select style={{ textAlign: 'center', }} className='Header-controls-combos' value={this.state.filterByTextAction} onChange={this._onChangeFilterByTextAction}>
              {filterByTextActionsList().map((anAction: filterByTextAction, index) => {
                return (
                  <option key={index} value={anAction.action} style={{ textAlign: 'center' }}>
                    {`${anAction.title}`}
                  </option>
                )
              })}
            </select>

            {/* Texto a filtrar */}
            <input disabled={!this.state.requireFilterText} className='Header-controls-container' style={styleHeaderControlsContainer} type="text" value={this.state.filterText} onChange={this._onChangeFilterText} />
          </label>
        }


        {/* Combos de filtro por Grupos */}
        {(this._simpleList.state.groupableFields.length <= 0) ? null :
          <label className='Header-controls-container' style={styleHeaderControlsContainer}>
            {/* Combo de Campos Agrupables */}
            <select style={{ textAlign: 'center' }} className='Header-controls-combos' value={this.state.filterByGroupField!.field} onChange={this._onChangeGroupField}>
              {this._simpleList.state.groupableFields.map((aField: ISimpleListCol, index) => {
                return (
                  <option key={index} value={aField.field}>
                    {`${strings.filterBy} ${aField.title}`}
                  </option>
                )
              })}
            </select>

            {/* Combo del Grupo Activo */}
            <select style={{ textAlign: 'center' }} className='Header-controls-combos' value={this.state.filterGroupedText} onChange={this._onChangeGroupText}>
              <option key={-1} value={(this.state.filterByGroupField) ? this.state.filterByGroupField.valueNoFilter : undefined}>
                {`${this.state.filterByGroupField!.valueNoFilter} (${this._simpleList.numItemsFilteredByText} ${this.props.labelItems})`}
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
          <label className='Header-controls-container' style={styleHeaderControlsContainer} >
            {`${this.state.dataFiltered.length} ${this.props.labelItems}.`}
          </label>
        }
      </div>
    );
  }

  public render(): JSX.Element {
    // console.log('SimpleListHtml render:');
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      let cellClassName = (this.state.isCompactMode) ? 'Table-cell' : 'Table-cell Table-cell-no-compact';
      let cellStyle = {};
      if (!this.state.isCompactMode)
        cellStyle = { borderBottomColor: this._theme.tableCellNoCompactBorderBottomColor }

      let styleMainContainer: React.CSSProperties = {
        backgroundColor: this._theme.mainContainerBackgroundColor,
        borderColor: this._theme.mainContainerBorderColor,
      };

      let styleTableContainer: React.CSSProperties = {
        backgroundColor: this._theme.tableContainerBackgroundColor,
        borderTopColor: this._theme.tableContainerBorderTopColor,
        scrollbarColor: this._theme.tableContainerScrollbarColor,
      };

      if (this.props.heightInPx && this.props.heightInPx > 0) {
        let heightInPx = (this.props.heightInPx < 500) ? 500 : this.props.heightInPx;
        styleTableContainer.overflowY = 'scroll';
        styleTableContainer.height = `${heightInPx}px`;
        styleTableContainer.maxHeight = `${heightInPx}px`;
      }

      return (
        <div className='Main-container' style={styleMainContainer}>
          <this._renderHeader />
          <div style={styleTableContainer} className='Table-container'>
            <table>
              <thead>
                <tr className='Table-header' key={'-1'}>
                  {this.props.columns.map((aColumn: ISimpleListCol, indice: number) => {
                    let styleCH = {
                      width: aColumn.width,
                      backgroundColor: this._theme.tableHeaderCellBackgroundColor,
                      borderBottomColor: this._theme.tableHeaderCellBackgroundColor,
                      borderLeftColor: this._theme.tableHeaderCellBackgroundColor,
                      color: this._theme.tableHeaderColor,
                    };

                    return (
                      <th
                        // key={aColumn.key}
                        key={`-1_${indice.toString()}`}
                        style={styleCH} className='Table-header-cell'
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <span style={{ verticalAlign: 'baseline', width: '100%', }}
                            title={(aColumn.headerTooltip) ? aColumn.headerTooltip : ''}
                          >
                            {aColumn.title}
                          </span>
                          {(!aColumn.canSortAndFilter) ? null :
                            <span
                              onClick={(event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => {
                                this._onClickHeaderColumn(aColumn.key!);
                              }}
                              style={{ verticalAlign: 'baseline', width: '20px', cursor: 'pointer' }}
                              title={strings.order_ClickToOrder.replace('[%s]', aColumn.title)}
                            >
                              <Flechas
                                name={
                                  (aColumn.isSorted) ?
                                    (aColumn.isSortedDescending) ? 'down' : 'up'
                                    :
                                    ''
                                }
                                fill={this._theme.tableHeaderColor}
                              />
                            </span>
                          }
                        </div>
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
                            <td key={`${dato.key}_${indice.toString()}`} className={cellClassName} style={cellStyle} >
                              <a href={dato[aColumn.fieldUrl]} target="_blank">
                                <span title={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.fieldUrl]}>
                                  {Array.isArray(dato[aColumn.field]) ? dato[aColumn.field].join(', ') : dato[aColumn.field]}
                                </span>
                              </a>
                            </td>
                          );
                        } else if (aColumn.isImage) {
                          return (
                            <td key={`${dato.key}_${indice.toString()}`} className={cellClassName} style={cellStyle} >
                              <img src={dato[aColumn.field]} width={aColumn.width} alt={(aColumn.fieldTooltip) ? dato[aColumn.fieldTooltip] : dato[aColumn.field]} />
                            </td>
                          );
                        } else {
                          return (
                            <td key={`${dato.key}_${indice.toString()}`} className={cellClassName} style={cellStyle} >
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
