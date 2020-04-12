import * as React from 'react';

import { ISimpleListProps, ISimpleListStates, IGroupedItem } from './ISimpleListProps';

export class SimpleList extends React.Component<ISimpleListProps, ISimpleListStates> {
  protected _allItems: any[];
  protected _ItemsFilteredByText: any[];
  protected _groupedItems: IGroupedItem[];

  public constructor(props: ISimpleListProps) {
    super(props);
    this._allItems = this.props.data.slice(0);

    this.state = {
      datos: this._allItems,
      isCompactMode: (this.props.listCompactMode) ? true : false,
      filterGroupedItem: '',
      filterText: '',
    }

    this._filterByText(this.state.filterText, false);
  }

  private _makeGroupedList(data: any[]): number {
    let numGroups: number = 0;

    if (this.props.fieldDropdownFilter && this.props.fieldDropdownFilter.field.length > 0) {
      this._groupedItems = new Array<IGroupedItem>();
      let field = this.props.fieldDropdownFilter.field;
      let valueIfNull = this.props.fieldDropdownFilter.valueIfNull;
      // Calculamos la lista de Items agrupados
      data.forEach(aRow => {
        let value = (aRow[field]) ? aRow[field] : valueIfNull;
        let newValue = this._groupedItems.find((aGroup) => (aGroup.value === value));
        if (newValue) {
          newValue.numOcurrences!++;
        } else {
          this._groupedItems.push({ value, numOcurrences: 1 });
          numGroups++;
        }
      })
      // Ordenamos la lista de Items agrupados
      this._groupedItems.sort((a, b) => (a.value > b.value) ? 1 : -1);
    }
    return (numGroups);
  }

  protected _filterByGroup(filterGroupedItem: string): void {
    if (this.props.fieldDropdownFilter) {
      let data = this._ItemsFilteredByText;
      if (filterGroupedItem != this.props.fieldDropdownFilter.valueNoFilter) {
        let field = this.props.fieldDropdownFilter.field;
        let fieldValue = (filterGroupedItem == this.props.fieldDropdownFilter.valueIfNull) ? '' : filterGroupedItem;
        data = data.filter(anItem => {
          return (anItem[field] == fieldValue);
        });
      }
      this.setState({ datos: data, filterGroupedItem: filterGroupedItem });
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
    this._makeGroupedList(data);

    if (refreshState) this.setState({ datos: data, filterGroupedItem: this.props.fieldDropdownFilter!.valueNoFilter, filterText: filterText })
  }


  public render(): JSX.Element {
    return (
      <div>
        <h3>Esto no deberia pintarse nunca (render de SimpleList)</h3>
      </div>
    );

  }
}

