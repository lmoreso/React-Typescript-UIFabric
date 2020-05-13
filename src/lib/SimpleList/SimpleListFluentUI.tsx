import * as React from 'react';

import './SimpleList.css';
import { strings } from './loc/SimpleListStrings';
import { languagesSupportedIds } from 'src/RestCountriesExample/loc/RestCountriesStrings';
import { ISlStyles, themeGray } from './SimpleListColors';
import { ISimpleListCol, SimpleList, filterByTextActionsId, filterByTextAction, filterByTextActionsList, IGroupedCol, ISimpleListProps, IGroupedItem } from './ISimpleListLib';

// FluentUI Imports
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { IColumn, ColumnActionsMode, SelectionMode, DetailsList, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
// import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
// import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';


const simpleListFluentUIVersion = '0.0.4';
export const simpleListFluentUIVersionLabel = `SimpleListFluentUI V.${simpleListFluentUIVersion}`;

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
  columnsDetailList: IColumn[];
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

    /* Color gris por defecto */
    this._theme = this.props.theme || themeGray;

    /* Creación de la Lista */
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
      columnsDetailList: this._makeFluentUIColumns(this.props.columns),
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
    // this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });
    // // Actualizo las IColumns
    // this._updateDetailListColumns();

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
    // // Actualizo las IColumns
    // this._updateDetailListColumns();
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

  private _updateDetailListColumns() {
    this.state.columnsDetailList.forEach((aCol: IColumn, index) => {
      aCol.isSorted = this._simpleList.columns[index].isSorted;
      aCol.isSortedDescending = this._simpleList.columns[index].isSortedDescending;
    });
  }

  private _onClickHeaderColumn(ev: any, theColumn: IColumn): void {
    // Se mira si la columna es ordenable
    let slCol = this._simpleList.columns.find((aCol) => (aCol.key == theColumn.key));
    if (slCol && slCol.canSortAndFilter) {
      // Se ordena
      this._simpleList.orderByColumn(theColumn.key);
      // Actualizo las IColumns
      this._updateDetailListColumns();

      // Actualizo el estado
      this.setState({
        dataFiltered: this._simpleList.state.dataFiltered,
        columnsDetailList: this.state.columnsDetailList.slice(0), // La copia es necesaria para que DetailList se renderize.
      });
    }
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

  private _makeFluentUIColumns(simpleListCols: ISimpleListCol[]): IColumn[] {
    let columns: IColumn[] = new Array<IColumn>();

    simpleListCols.forEach((aSlColumn: ISimpleListCol, indice) => {

      let theNewIColumn: IColumn = {
        // key: indice.toString(),
        key: aSlColumn.key!,
        name: aSlColumn.title,
        fieldName: aSlColumn.field,
        minWidth: aSlColumn.width / 3,
        maxWidth: aSlColumn.width * 0.70,
        // isRowHeader: true,
        isResizable: true,
        columnActionsMode: ColumnActionsMode.clickable,
        // isSorted: true,
        // isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        // onColumnClick: (ev: any, aColumn: IColumn) => {
        //   this._onClickHeaderColumn(aColumn.key)
        // },
        // onColumnClick: this._onClickHeaderColumn,
        data: 'string',
        isPadded: true
      };
      if (aSlColumn.fieldUrl || aSlColumn.fieldTooltip || aSlColumn.isImage) {
        if (aSlColumn.fieldUrl && aSlColumn.fieldTooltip) {
          theNewIColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(aSlColumn.fieldTooltip) ? aSlColumn.fieldTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Link hRef={item[(aSlColumn.fieldUrl) ? aSlColumn.fieldUrl : 0]} target='_blank'>
                  {item[aSlColumn.field]}
                </Link>
              </TooltipHost>
            );
          }
        } else if (aSlColumn.fieldTooltip) {
          theNewIColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(aSlColumn.fieldTooltip) ? aSlColumn.fieldTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                {item[aSlColumn.field]}
              </TooltipHost>
            );
          }
        } else if (aSlColumn.isImage == true) {
          theNewIColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[aSlColumn.field]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Image
                  src={item[aSlColumn.field]}
                  width={aSlColumn.width}
                />
              </TooltipHost>
            );
          }
        } else {
          theNewIColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(aSlColumn.fieldUrl) ? aSlColumn.fieldUrl : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <a href={item[(aSlColumn.fieldUrl) ? aSlColumn.fieldUrl : 0]} target='_blank'>
                  {item[aSlColumn.field]}
                </a>
              </TooltipHost>
            );
          }
        }
      }
      columns.push(theNewIColumn);
    });

    return (columns);
  }

  private onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<{}> = tooltipHostProps => (
      <TooltipHost {...tooltipHostProps} />
    );
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  public render(): JSX.Element {
    // console.log('SimpleListHtml render:');
    if (this.props.hidden) {
      return (<div></div>);
    } else {

      /*       
            let cellClassName = (this.state.isCompactMode) ? 'Table-cell' : 'Table-cell Table-cell-no-compact';
            let cellStyle = {};
            if (!this.state.isCompactMode)
              cellStyle = { borderBottomColor: this._theme.tableCellNoCompactBorderBottomColor }
      
       */
      let styleTableContainer: React.CSSProperties = {
        backgroundColor: this._theme.tableContainerBackgroundColor,
        borderTopColor: this._theme.tableContainerBorderTopColor,
        // scrollbarColor: this._theme.tableContainerScrollbarColor,
      };

      if (this.props.heightInPx && this.props.heightInPx > 0) {
        let heightInPx = (this.props.heightInPx < 500) ? 500 : this.props.heightInPx;
        styleTableContainer.overflowY = 'hidden';
        styleTableContainer.height = `${heightInPx}px`;
        styleTableContainer.maxHeight = `${heightInPx}px`;
        styleTableContainer.position = 'relative';
      }

      let styleMainContainer: React.CSSProperties = {
        backgroundColor: this._theme.mainContainerBackgroundColor,
        borderColor: this._theme.mainContainerBorderColor,
      };

      const classNames = mergeStyleSets({
        detailList: {
          backgroundColor: this._theme.mainContainerBackgroundColor,
        },
      });


      return (
        <div className='Main-container' style={styleMainContainer}>
          <this._renderHeader />
          <div style={styleTableContainer} className='Table-container' data-is-scrollable="true">
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}
              data-is-scrollable="true"
              style={{ scrollbarColor: this._theme.tableContainerScrollbarColor }}
            >
              <DetailsList
                items={this.state.dataFiltered}
                compact={this.state.isCompactMode}
                columns={this.state.columnsDetailList}
                selectionMode={SelectionMode.none}
                className={classNames.detailList}
                onRenderDetailsHeader={this.onRenderDetailsHeader}
                onColumnHeaderClick={this._onClickHeaderColumn}
              />
            </ScrollablePane>
          </div>
        </div>
      );
    }
  }
}
