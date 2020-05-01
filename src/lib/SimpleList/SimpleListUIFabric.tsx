import * as React from 'react';
import { DetailsList, /* DetailsListLayoutMode, */ IColumn, SelectionMode, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { Sticky, /* StickyPositionType */ } from 'office-ui-fabric-react/lib/Sticky';
// import { ScrollablePane, /* ScrollbarVisibility */ } from 'office-ui-fabric-react/lib/ScrollablePane';

import { copyAndSort, ISimpleListCol, copyAndSortByKey, IGroupedItem } from './ISimpleListLib';

export interface ISimpleListUIFabricProps {
  data: any[];
  columns: ISimpleListCol[];
  labelItem: string;
  labelItems: string;
  fieldsTextFilter?: string[];
  fieldDropdownFilter?: { valueIfNull: string; field: string; valueNoFilter: string };
  hidden: boolean;
  listCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  showLabel?: boolean;
  fixedHeader?: boolean;
}


const classNames = mergeStyleSets({
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '15px'
  },
  subWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
});

const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px'
  }
};

interface ISimpleListUIFabricStates {
  datos: any[];
  columns: IColumn[];
  isCompactMode: boolean;
  filterGroupedOption: number | string;
  filterText: string;
}

const ALL_ITEMS = -1;
export class SimpleListUIFabric extends React.Component<ISimpleListUIFabricProps, ISimpleListUIFabricStates> {
  private _allItems: any[];
  private _ItemsFilteredByText: any[];
  private _groupedItems: IGroupedItem[];
  private _dropdownOptionList: IDropdownOption[];

  public constructor(props: ISimpleListUIFabricProps) {
    super(props);
    this._allItems = this.props.data.slice(0);

    this._renderHeader = this._renderHeader.bind(this);
    this._filterByGroup = this._filterByGroup.bind(this);

    this.state = {
      datos: this._allItems,
      columns: this._makeColumns(this.props.columns),
      isCompactMode: (this.props.listCompactMode) ? true : false,
      filterGroupedOption: ALL_ITEMS,
      filterText: '',
    }

    this._filterByText(this.state.filterText, false);
  }

  private _makeDropdownList(data: any[]): number {
    let numItems: number = 0;
    let numGroups: number = 0;

    if (this.props.fieldDropdownFilter && this.props.fieldDropdownFilter.field.length > 0) {
      this._groupedItems = new Array<IGroupedItem>();
      let field = this.props.fieldDropdownFilter.field;
      let valueIfNull = this.props.fieldDropdownFilter.valueIfNull;
      // Calculamos la lista de Items agrupados
      data.forEach((aRow, index) => {
        numItems++;
        let value = (aRow[field]) ? aRow[field] : valueIfNull;
        let newValue = this._groupedItems.find((aGroup) => (aGroup.value === value));
        if (newValue) {
          newValue.numOcurrences!++;
        } else {
          this._groupedItems.push({ key: index, value, numOcurrences: 1 });
          numGroups++;
        }
      })
      // Ordenamos la lista de Items agrupados
      this._groupedItems.sort((a, b) => (a.value > b.value) ? 1 : -1);
      // Creamos la lista de opciones para el combo
      this._dropdownOptionList = new Array<IDropdownOption>();
      // Añadimos opción al principio para no filtrar, que informará del numero de Items (si se informa la props.fieldDropdownFilter.valueNoFilter)
      if (this.props.fieldDropdownFilter.valueNoFilter)
        this._dropdownOptionList.push({ key: ALL_ITEMS, text: `${this.props.fieldDropdownFilter.valueNoFilter} (${numItems})` });
      // Añadimos el resto de grupos al combo
      this._groupedItems.forEach((agroupedItem, indice) => {
        this._dropdownOptionList.push({ key: indice, text: `${agroupedItem.value} (${agroupedItem.numOcurrences})` })
      });

    }
    return (numGroups);
  }

  private _filterByGroup(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void {
    if (this.props.fieldDropdownFilter) {
      let data = this._ItemsFilteredByText;
      if (item.key != ALL_ITEMS) {
        let field = this.props.fieldDropdownFilter.field;
        let fieldValue = (this._groupedItems[item.key].value == this.props.fieldDropdownFilter.valueIfNull) ?
          '' : this._groupedItems[item.key].value;
        // console.log('fieldValue', fieldValue);
        data = data.filter(item => {
          // console.log(item[field]);
          return (item[field] == fieldValue);

          // if (item[field] && item[field].toLowerCase() === fieldValue)
          //   return (true);
          // if (!item[field] && this.props.fieldDropdownFilter.valueIfNull === fieldValue)
          //   return (true);
          // return (false);
        });
      }
      this.setState({ datos: data, filterGroupedOption: item.key });
    }
  }

  private _filterByText(filterText: string, refreshState: boolean = true): void {
    let data = this._allItems;

    if (filterText && filterText.length > 0 && this.props.fieldsTextFilter && this.props.fieldsTextFilter.length > 0) {
      data = data.filter(item => {
        let numFileds = 0;
        this.props.fieldsTextFilter!.forEach((field) => {
          if (item[field] && item[field].toLowerCase().indexOf(filterText.toLowerCase()) > -1) numFileds++;
        });
        return ((numFileds > 0));
      });
    }
    this._ItemsFilteredByText = data.slice(0);
    this._makeDropdownList(data);

    if (refreshState) this.setState({ datos: data, filterGroupedOption: ALL_ITEMS, filterText: filterText })
  }

  private _makeColumns(simpleListCols: ISimpleListCol[]): IColumn[] {
    let columns: IColumn[] = new Array<IColumn>();

    simpleListCols.forEach((aColumn: ISimpleListCol, indice) => {

      let theColumn: IColumn = {
        key: indice.toString(),
        name: aColumn.title,
        fieldName: aColumn.field,
        minWidth: aColumn.width,
        // maxWidth: aColumn.width,
        // isRowHeader: true,
        isResizable: true,
        columnActionsMode: ColumnActionsMode.clickable,
        // isSorted: true,
        // isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        // onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      };
      if (aColumn.fieldUrl || aColumn.fieldTooltip || aColumn.isImage) {
        if (aColumn.fieldUrl && aColumn.fieldTooltip) {
          theColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(aColumn.fieldTooltip) ? aColumn.fieldTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Link hRef={item[(aColumn.fieldUrl) ? aColumn.fieldUrl : 0]} target='_blank'>
                  {item[aColumn.field]}
                </Link>
              </TooltipHost>
            );
          }
        } else if (aColumn.fieldTooltip) {
          theColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(aColumn.fieldTooltip) ? aColumn.fieldTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                {item[aColumn.field]}
              </TooltipHost>
            );
          }
        } else if (aColumn.isImage == true) {
          theColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[aColumn.field]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Image
                  src={item[aColumn.field]}
                  width={aColumn.width}
                />
              </TooltipHost>
            );
          }
        } else {
          theColumn.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(aColumn.fieldUrl) ? aColumn.fieldUrl : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <a href={item[(aColumn.fieldUrl) ? aColumn.fieldUrl : 0]} target='_blank'>
                  {item[aColumn.field]}
                </a>
              </TooltipHost>
            );
          }
        }
      }
      columns.push(theColumn);
    });

    return (columns);
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const newColumns: IColumn[] = this.state.columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    let hayQueOrdenar: boolean = true;
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        if (!currColumn.isSorted) {
          currColumn.isSorted = true;
          currColumn.isSortedDescending = false
        } else if (!currColumn.isSortedDescending) {
          currColumn.isSortedDescending = true
        } else {
          currColumn.isSorted = false;
          hayQueOrdenar = false;
        }
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    this.setState({
      columns: newColumns,
      datos: (hayQueOrdenar) ?
        copyAndSort(this.state.datos, currColumn.fieldName!, currColumn.isSortedDescending)
        :
        copyAndSortByKey(this.state.datos, false)
    });
  };

  private _renderHeader(): JSX.Element {
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255)' }}>
        <div className={classNames.controlWrapper}>
          {(!(this.props.showToggleCompactMode)) ? null :
            <Toggle
              hidden={!this.props.showToggleCompactMode}
              label="Enable compact mode"
              checked={this.state.isCompactMode}
              onChange={(ev, checked: boolean): void => {
                this.setState({ isCompactMode: checked });
              }}
              onText="Compact"
              offText="Normal"
              styles={controlStyles}
            />
          }
          {(!(this.props.fieldsTextFilter && this.props.fieldsTextFilter.length > 0)) ? null :
            <SearchBox
              placeholder="Filter by name"
              // onSearch={(text: string): void => {
              onChange={(text: string): void => {
                this._filterByText(text);
              }}
              styles={controlStyles}
            />
          }
          {(!(this.props.fieldDropdownFilter)) ? null :
            <Dropdown
              selectedKey={this.state.filterGroupedOption}
              onChange={this._filterByGroup}
              options={this._dropdownOptionList}
              styles={controlStyles}
              style={{ width: 220 }}
            />
          }
          {(!this.props.showLabel) ? null :
            <Label styles={controlStyles}>{`${this.state.datos.length} ${this.props.labelItems}.`}</Label>
          }
        </div>
      </div>
    );
  }

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      return (
        <div >
          {(this.props.fixedHeader) ? <Sticky> <this._renderHeader /> </Sticky> : <this._renderHeader />}
          <DetailsList
            items={this.state.datos}
            compact={this.state.isCompactMode}
            columns={this.state.columns}
            // layoutMode={DetailsListLayoutMode.justified}
            // disableSelectionZone= {true}
            selectionMode={SelectionMode.none}
            onColumnHeaderClick={this._onColumnClick}
          // isHeaderVisible={true}
          />
        </div>
      );
    }
  }
}
