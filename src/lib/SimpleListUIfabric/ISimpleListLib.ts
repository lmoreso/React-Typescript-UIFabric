export interface ISimpleListProps {
    data: any[];
    columns: ISimpleListCol[];
    labelItem: string;
    labelItems: string;
    fieldsTextFilter?: string[];
    fieldDropdownFilter?: { valueIfNull: string; field: string; valueNoFilter: string };
}

export const ALL_ITEMS_GROUPED_KEY = -1;

export interface ISimpleListStates {
    dataFiltered: any[];
    groupedItems: IGroupedItem[];
    filterGroupedItem: string;
    filterText: string;
}

export interface ISimpleListCol {
    title: string;
    field: string;
    width: number;
    fieldTooltip?: string;
    fieldUrl?: string;
    isImage?: boolean;
    order?: boolean;
}

export interface IGroupedItem {
    value: string;
    numOcurrences: number;
}

export function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export function copyAndSortByKey<T>(items: T[], isSortedDescending?: boolean): T[] {
    const key = 'key';
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[key]) < parseInt(b[key]) : parseInt(a[key]) > parseInt(b[key])) ? 1 : -1));
}

export class SimpleList {
    private _allItems: any[];
    private _ItemsFilteredByText: any[];
    private props: ISimpleListProps;

    public constructor(props: ISimpleListProps) {
        this.props = props;
        this._allItems = props.data.slice(0);
        this._ItemsFilteredByText = this._allItems.slice(0);
    }

    public initState(state: ISimpleListStates): ISimpleListStates {
        state = {
            dataFiltered: this._allItems,
            filterGroupedItem: '',
            filterText: '',
            groupedItems: this._makeGroupedList(this._allItems),
        }
        return (state);
    }

    public filterByText(filterText: string, state: ISimpleListStates): ISimpleListStates {
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

        state = {
            dataFiltered: this._allItems,
            filterGroupedItem: '',
            filterText: filterText,
            groupedItems: this._makeGroupedList(this._allItems),
        }
        return (state);
    }

    private _makeGroupedList(data: any[]): IGroupedItem[] {
        // let numGroups: number = 0;
        let newGroupedItem = new Array<IGroupedItem>();

        if (this.props.fieldDropdownFilter && this.props.fieldDropdownFilter.field.length > 0) {
            let field = this.props.fieldDropdownFilter.field;
            let valueIfNull = this.props.fieldDropdownFilter.valueIfNull;
            // Calculamos la lista de Items agrupados
            data.forEach(aRow => {
                let value = (aRow[field]) ? aRow[field] : valueIfNull;
                let newValue = newGroupedItem.find((aGroup) => (aGroup.value === value));
                if (newValue) {
                    newValue.numOcurrences!++;
                } else {
                    newGroupedItem.push({ value, numOcurrences: 1 });
                    // numGroups++;
                }
            })
            // Ordenamos la lista de Items agrupados
            newGroupedItem.sort((a, b) => (a.value > b.value) ? 1 : -1);
        }

        return (newGroupedItem);
    }

    public filterByGroup(filterGroupedItem: string, state: ISimpleListStates): ISimpleListStates {
        if (this.props.fieldDropdownFilter) {
            let data = this._ItemsFilteredByText;
            let fieldValue = (filterGroupedItem == this.props.fieldDropdownFilter.valueIfNull) ? '' : filterGroupedItem;
            
            if (filterGroupedItem != this.props.fieldDropdownFilter.valueNoFilter) {
                let field = this.props.fieldDropdownFilter.field;
                data = data.filter(anItem => {
                    return (anItem[field] == fieldValue);
                });
            }
            state.dataFiltered = data;
            state.filterGroupedItem = filterGroupedItem;
        }
        
        return (state);
    }

}

