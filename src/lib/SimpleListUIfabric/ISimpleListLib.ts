export interface ISimpleListProps {
    data: any[];
    columns: ISimpleListCol[];
    labelItem: string;
    labelItems: string;
    fieldsTextFilter?: string[];
    fieldsDropdownFilter?: { valueIfNull: string; field: string; valueNoFilter: string };
}

export const ALL_ITEMS_GROUPED_KEY = -1;

export interface ISimpleListStates {
    dataFiltered: any[];
    groupedItems: IGroupedItem[];
    filterGroupedItem: string;
    filterText: string;
    numItemsFilteredByText: number;
}

export interface ISimpleListCol {
    key?: string;
    title: string;
    field: string;
    width: number;
    fieldTooltip?: string;
    fieldUrl?: string;
    isImage?: boolean;
    canSortAndFilter?: boolean;
    isSorted?: boolean;
    isSortedDescending?: boolean;
    canGroup?: boolean;
}

export interface IGroupedItem {
    value: string;
    numOcurrences: number;
}

export function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

function sortByColumn<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    items.sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    return items;
}


export function copyAndSortByKey<T>(items: T[], isSortedDescending?: boolean): T[] {
    const key = 'key';
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[key]) < parseInt(b[key]) : parseInt(a[key]) > parseInt(b[key])) ? 1 : -1));
}

function sortByKey<T>(items: T[], isSortedDescending?: boolean): T[] {
    const key = 'key';
    items.sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[key]) < parseInt(b[key]) : parseInt(a[key]) > parseInt(b[key])) ? 1 : -1));
    return items;
}

export class SimpleList {
    private _allItems: any[];
    private _ItemsFilteredByText: any[];
    private props: ISimpleListProps;
    private _state: ISimpleListStates;
    public get state() {
        return this._state
    };

    public constructor(props: ISimpleListProps) {
        this.props = props;
        this._allItems = props.data.slice(0);
        this._ItemsFilteredByText = this._allItems.slice(0);

        this.props.columns.forEach((aColumn: ISimpleListCol, indice) => {
            aColumn.key = indice.toString();
        });

        this._state = {
            dataFiltered: this._allItems,
            filterGroupedItem: '',
            filterText: '',
            groupedItems: this._makeGroupedList(this._allItems),
            numItemsFilteredByText: this._allItems.length,
        }
    }

    public orderByColumn(keyColumn: string): void {
        let hayQueOrdenar: boolean = false;
        let currColumn: ISimpleListCol;
        this.props.columns.forEach((aColumn: ISimpleListCol) => {
            if (aColumn.key === keyColumn) {
                hayQueOrdenar = true;
                currColumn = aColumn;
                if (!aColumn.isSorted) {
                    aColumn.isSorted = true;
                    aColumn.isSortedDescending = false
                } else if (!aColumn.isSortedDescending) {
                    aColumn.isSortedDescending = true
                } else {
                    aColumn.isSorted = false;
                    hayQueOrdenar = false;
                }
            } else {
                aColumn.isSorted = false;
                aColumn.isSortedDescending = true;
            }
        });

        if (hayQueOrdenar)
            sortByColumn(this._state.dataFiltered, currColumn!.field, currColumn!.isSortedDescending)
        else
            sortByKey(this._state.dataFiltered, false)
    }

    public filterByText(filterText: string): void {
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

        this._state = {
            dataFiltered: this._ItemsFilteredByText,
            filterGroupedItem: '',
            filterText: filterText,
            groupedItems: this._makeGroupedList(this._ItemsFilteredByText),
            numItemsFilteredByText: this._ItemsFilteredByText.length,
        }
    }

    private _makeGroupedList(data: any[]): IGroupedItem[] {
        // let numGroups: number = 0;
        let newGroupedItem = new Array<IGroupedItem>();

        if (this.props.fieldsDropdownFilter && this.props.fieldsDropdownFilter.field.length > 0) {
            let field = this.props.fieldsDropdownFilter.field;
            let valueIfNull = this.props.fieldsDropdownFilter.valueIfNull;
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

    public filterByGroup(filterGroupedItem: string): void {
        if (this.props.fieldsDropdownFilter) {
            let data = this._ItemsFilteredByText;
            let fieldValue = (filterGroupedItem == this.props.fieldsDropdownFilter.valueIfNull) ? '' : filterGroupedItem;

            if (filterGroupedItem != this.props.fieldsDropdownFilter.valueNoFilter) {
                let field = this.props.fieldsDropdownFilter.field;
                data = data.filter(anItem => {
                    return (anItem[field] == fieldValue);
                });
            }
            this._state.dataFiltered = data;
            this._state.filterGroupedItem = filterGroupedItem;
        }
    }

}

