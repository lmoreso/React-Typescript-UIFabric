import * as React from 'react';

import { ISimpleListCol, SimpleList, filterByTextActionsId, filterByTextAction, filterByTextActionsList, IGroupedCol, ISimpleListProps, IGroupedItem } from './ISimpleListLib';
import './SimpleList.css';
import { strings } from './loc/SimpleListStrings';
import { languagesSupportedIds } from 'src/RestCountriesExample/loc/RestCountriesStrings';
import { Flechas } from './img/SimpleListIconos';
import { ISlStyles, themeGray } from './SimpleListColors';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

const simpleListVersion = '0.1.2';
export const simpleListVersionLabel = `SimpleList V.${simpleListVersion}`;

export interface ISimpleListFluentUIProps extends ISimpleListProps {
  hidden: boolean;
  isCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  showLabel?: boolean;
  heightInPx?: number;
  theme?: ISlStyles;
}

interface ISimpleListFluentUIStates {
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

export class SimpleListFluentUI extends React.Component<ISimpleListFluentUIProps, ISimpleListFluentUIStates> {
  private _simpleList: SimpleList;
  private _theme: ISlStyles;
  private _comboFilterByTextAction: IDropdownOption[];
  private _comboFilterByTextField: IDropdownOption[];
  private _comboFilterByGroupField: IDropdownOption[];
  private _comboFilterByGroupItems: IDropdownOption[];

  public constructor(props: ISimpleListFluentUIProps) {
    super(props);
    this._theme = this.props.theme || themeGray;
    this._simpleList = new SimpleList(props);

    /* Combo de Operación de filtro de texto*/
    this._comboFilterByTextAction = new Array<IDropdownOption>();
    filterByTextActionsList().forEach((anAction: filterByTextAction, index) => {
      this._comboFilterByTextAction.push({ key: anAction.action, text: anAction.title });
    });

    /* Combo de Field de filtro de texto*/
    this._comboFilterByTextField = new Array<IDropdownOption>();
    this._simpleList.state.filterableFields.forEach((aField: ISimpleListCol, index) => {
      this._comboFilterByTextField.push({ key: aField.field, text: aField.title });
    });

    /* Combo de Field de filtro de grupo*/
    this._comboFilterByGroupField = new Array<IDropdownOption>();
    this._simpleList.state.groupableFields.forEach((aField: ISimpleListCol, index) => {
      this._comboFilterByGroupField.push({ key: aField.field, text: aField.title });
    });

    /* Combo de Items de grupo*/
    this._makeComboFilterByGroupItems();

    this.state = {
      dataFiltered: this._simpleList.state.dataFiltered,
      filterText: this._simpleList.state.filterText,
      filterGroupedText: this._simpleList.state.filterByGroupField!.valueNoFilter,
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

  private _onChangeGroupText(event: any, option: IDropdownOption): void {
    this._simpleList.filterByGroup(option.key.toString());
    this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
      filterGroupedText: this._simpleList.state.filterByGroupText,
    });
  }

  private _onChangeGroupField(event: any, option: IDropdownOption): void {
    this._simpleList.makeGroupedItemsList(option.key.toString());
    if (this._simpleList.state.filterByGroupField) {

      /* Combo de Items de grupo*/
      this._makeComboFilterByGroupItems();

      this.setState({
        filterGroupedText: this._simpleList.state.filterByGroupField!.valueNoFilter,
        filterByGroupField: this._simpleList.state.filterByGroupField,
        dataFiltered: this._simpleList.state.dataFiltered,
      });
    }
  }

  private _makeComboFilterByGroupItems() {
    this._comboFilterByGroupItems = new Array<IDropdownOption>();
    this._comboFilterByGroupItems.push({
      key: this._simpleList.state.filterByGroupField!.valueNoFilter,
      text: `${this._simpleList.state.filterByGroupField!.valueNoFilter} (${this._simpleList.numItemsFilteredByText} ${this.props.labelItems})`
    });
    this._simpleList.state.groupedItems.forEach((aGroup: IGroupedItem) => {
      this._comboFilterByGroupItems.push({
        key: aGroup.value,
        text: `${aGroup.value} (${aGroup.numOcurrences} ${this.props.labelItems})`
      });
    });
  }

  private _onChangeFilterByTextAction(event: any, option: IDropdownOption): void {

    this._filterByText(this.state.filterText, option.key as filterByTextActionsId, this.state.filterByTextField!);
  }

  private _onChangeFilterByTextField(event: any, option: IDropdownOption): void {
    let newFilterByTextField = this._simpleList.state.filterableFields.find(aColumn => (aColumn.field == option.key));
    if (newFilterByTextField)
      this._filterByText(this.state.filterText, this.state.filterByTextAction, newFilterByTextField);
  }

  private _filterByText(textFilter: string, filterByTextAction: filterByTextActionsId, filterByTextField: ISimpleListCol): void {
    this._simpleList.filterByText(textFilter, filterByTextAction, filterByTextField);
    this._makeComboFilterByGroupItems();
    // this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
      filterText: this._simpleList.state.filterText,
      filterGroupedText: this._simpleList.state.filterByGroupField!.valueNoFilter,
      filterByTextAction: this._simpleList.state.filterByTextActionId,
      filterByTextField: this._simpleList.state.filterByTextField,
      requireFilterText: this._simpleList.state.requireFilterText,
    });
  }

  private _onChangeFilterText(newText: string): void {
    this._filterByText(newText, this.state.filterByTextAction, this.state.filterByTextField!);
  }

  private _onClickHeaderColumn(columnKey: string): void {
    this._simpleList.orderByColumn(columnKey);
    this.setState({
      dataFiltered: this._simpleList.state.dataFiltered,
    });
  }

  private _onChangeCheckBoxCompactMode(event: any, checked?: boolean | undefined): void {
    this.setState({
      isCompactMode: (checked) ? true : false,
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
            {/* {strings.config_CompactMode} */}
            <Toggle
              hidden={!this.props.showToggleCompactMode}
              // label={strings.config_CompactMode}
              checked={this.state.isCompactMode}
              onChange={this._onChangeCheckBoxCompactMode}
              onText={strings.config_CompactMode}
              offText={strings.config_CompactMode}
            />
          </label>
        }

        {/* Controles de filtro por Texto */}
        {(this._simpleList.state.groupableFields.length <= 0) ? null :
          <label className='Header-controls-container' style={styleHeaderControlsContainer} >
            {/* Combo de Campos Filtrables */}
            <span style={{ textAlign: 'center' }} className='Header-controls-combos' >
              <Dropdown
                selectedKey={this.state.filterByTextField!.field}
                onChange={this._onChangeFilterByTextField}
                options={this._comboFilterByTextField}
                // styles={controlStyles}
                style={{ minWidth: 140 }}
              />
            </span>

            {/* Combo de operación de filtro */}
            <span style={{ textAlign: 'center', }} className='Header-controls-combos' >
              <Dropdown
                selectedKey={this.state.filterByTextAction}
                onChange={this._onChangeFilterByTextAction}
                options={this._comboFilterByTextAction}
                // styles={controlStyles}
                style={{ minWidth: 120 }}
              />
            </span>

            {/* Texto a filtrar */}
            <span className='Header-controls-container' style={styleHeaderControlsContainer} >
              <SearchBox
                // placeholder="Filter by name"
                // onSearch={(text: string): void => {
                onChange={this._onChangeFilterText}
                // styles={controlStyles}
                // hidden={!this.state.requireFilterText}
                disabled={!this.state.requireFilterText}
                value={this.state.filterText}
                style={{ width: 100 }}
              />
            </span>
            {/* <input disabled={!this.state.requireFilterText} type="text" value={this.state.filterText} onChange={this._onChangeFilterText} /> */}
          </label>
        }

        {/* Combos de filtro por Grupos */}
        {(this._simpleList.state.groupableFields.length <= 0) ? null :
          <label className='Header-controls-container' style={styleHeaderControlsContainer}>
            {/* Combo de Campos Agrupables */}
            <span style={{ textAlign: 'center' }} className='Header-controls-combos'>
              <Dropdown
                selectedKey={this.state.filterByGroupField!.field}
                onChange={this._onChangeGroupField}
                options={this._comboFilterByGroupField}
                // styles={controlStyles}
                style={{ minWidth: 140 }}
              />
            </span>

            {/* Combo de Items de Grupo */}
            <span style={{ textAlign: 'center', }} className='Header-controls-combos' >
              {console.log('this.state.filterGroupedText', this.state.filterGroupedText)}
              <Dropdown
                selectedKey={this.state.filterGroupedText}
                onChange={this._onChangeGroupText}
                options={this._comboFilterByGroupItems}
                // styles={controlStyles}
                style={{ minWidth: 250 }}
              />
            </span>

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
                              onClick={(!aColumn.canSortAndFilter) ? undefined : (event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => {
                                this._onClickHeaderColumn(aColumn.key!);
                              }}
                              style={{ verticalAlign: 'baseline', width: '20px', cursor: 'pointer' }}
                              title={strings.order_ClickToOrder.replace('[%s]', aColumn.title)}
                            >
                              {/* <img
                                style={{ alignSelf: 'baseline' }}
                                src={
                                  (aColumn.isSorted) ?
                                    (aColumn.isSortedDescending) ? imgArrowDown : imgArrowUp
                                    :
                                    imgArrowScroll
                                }
                              /> */}
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
