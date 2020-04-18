export interface ISimpleListProps {
    data: any[];
    columns: ISimpleListCol[];
    labelItem: string;
    labelItems: string;
    fieldsDropdownFilter?: { valueIfNull: string; field: string; valueNoFilter: string };
}

export const ALL_ITEMS_GROUPED_KEY = -1;

export enum filterByTextActions {
    startBy = 'startBy', contains = 'contains', finishBy = 'finishBy',
    greater = 'greater', greaterOrEqual = 'greaterOrEqual', equal = 'equal',
    smallerOrEqual = 'smallerOrEqual', smaller = 'smaller', nullValue = 'nullValue',
    notNull = 'notNull',
}

export interface filterByTextActionLabel {
    action: filterByTextActions;
    title: string;
    filterFunction: (item: any, textFilter: string, field: string, isNumeric: boolean) => boolean;
    notRequireText?: boolean;
}

export const filterByTextActionsLabels: filterByTextActionLabel[] = [
    {
        action: filterByTextActions.startBy, title: 'Starts by',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
            (item[field] && item[field].toString().trim().toLowerCase().indexOf(textFilter.toLowerCase()) == 0) ? true : false,
    },
    {
        action: filterByTextActions.contains, title: 'Contains',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
            (item[field] && item[field].toString().trim().toLowerCase().indexOf(textFilter.toLowerCase()) > -1) ? true : false,
    },
    {
        action: filterByTextActions.finishBy, title: 'Finish by',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
            (!item[field] || textFilter.length <= 0) ? false : (item[field].toString().trim().slice(-textFilter.length) == textFilter) ? true : false,
    },
    {
        action: filterByTextActions.greater, title: '>',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
            let numberFilter: number = parseInt(textFilter);
            if (isNaN(numberFilter) || !isNumeric) {
                return( (textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() > textFilter.toLowerCase()) ? true : false);
            }  else {
                return( (item[field] && parseInt(item[field]) > numberFilter) ? true : false);
            }
        },
    },
    {
        action: filterByTextActions.greaterOrEqual, title: '>=',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
            let numberFilter: number = parseInt(textFilter);
            if (isNaN(numberFilter) || !isNumeric) {
                return( (textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() >= textFilter.toLowerCase()) ? true : false);
            }  else {
                return( (item[field] && parseInt(item[field]) >= numberFilter) ? true : false);
            }
        },
    },
    {
        action: filterByTextActions.equal, title: '=',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
            let numberFilter: number = parseInt(textFilter);
            if (isNaN(numberFilter) || !isNumeric) {
                return( (textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() == textFilter.toLowerCase()) ? true : false);
            }  else {
                return( (item[field] && parseInt(item[field]) == numberFilter) ? true : false);
            }
        },
    },
    {
        action: filterByTextActions.smallerOrEqual, title: '<=',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
            let numberFilter: number = parseInt(textFilter);
            if (isNaN(numberFilter) || !isNumeric) {
                return( (textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() <= textFilter.toLowerCase()) ? true : false);
            }  else {
                return( (item[field] && parseInt(item[field]) <= numberFilter) ? true : false);
            }
        },
    },
    {
        action: filterByTextActions.smaller, title: '<',
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
            let numberFilter: number = parseInt(textFilter);
            if (isNaN(numberFilter) || !isNumeric) {
                return( (textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() < textFilter.toLowerCase()) ? true : false);
            }  else {
                return( (item[field] && parseInt(item[field]) < numberFilter) ? true : false);
            }
        },
    },
    {
        action: filterByTextActions.nullValue, title: 'Is Null',
        notRequireText: true,
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
            (item[field] == null || item[field].toString().trim() == '') ? true : false,
    },
    {
        action: filterByTextActions.notNull, title: 'Is Not Null',
        notRequireText: true,
        filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
            (item[field] && item[field].toString().trim().length > 0) ? true : false,
    },
]

export const DEF_FILTER_BY_TEXT_ACTION_LABEL = filterByTextActionsLabels[1];

function getFilterByTextActionLabel(action: filterByTextActions): filterByTextActionLabel {
    let theActionLabel = filterByTextActionsLabels.find((anActionLabel) => (action === anActionLabel.action) ? true : false);
    return ((theActionLabel) ? theActionLabel : DEF_FILTER_BY_TEXT_ACTION_LABEL);
};

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
    isNumeric?: boolean;
}

export interface IGroupedItem {
    value: string;
    numOcurrences: number;
}

export function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

function sortByText<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    items.sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    return items;
}


export function copyAndSortByKey<T>(items: T[], isSortedDescending?: boolean): T[] {
    const key = 'key';
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[key]) < parseInt(b[key]) : parseInt(a[key]) > parseInt(b[key])) ? 1 : -1));
}

function sortByNumber<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    items.sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[columnKey]) < parseInt(b[columnKey]) : parseInt(a[columnKey]) > parseInt(b[columnKey])) ? 1 : -1));
    return items;
}

export interface ISimpleListStates {
    dataFiltered: any[];
    groupableFields: ISimpleListCol[];
    filterableFields: ISimpleListCol[];
    filterText: string;
    filterByTextAction: filterByTextActions;
    filterByTextField: ISimpleListCol | undefined;
    requireFilterText: boolean;
    groupedItems: IGroupedItem[];
    filterGroupedText: string;
}

export class SimpleList {
    private _allItems: any[];
    private _ItemsFilteredByText: any[];
    public get numItemsFilteredByText(): number {
        return(this._ItemsFilteredByText.length);
    };
    private props: ISimpleListProps;
    private readonly _state: ISimpleListStates;
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
            filterGroupedText: '',
            filterText: '',
            groupedItems: this._makeGroupedList(this._allItems),
            groupableFields: [],
            filterableFields: [],
            filterByTextAction: DEF_FILTER_BY_TEXT_ACTION_LABEL.action,
            filterByTextField: undefined,
            requireFilterText: (DEF_FILTER_BY_TEXT_ACTION_LABEL.notRequireText) ? false : true,
        }

        this.props.columns.forEach((aColumn: ISimpleListCol) => {
            if (aColumn.canGroup) this._state.groupableFields.push(aColumn);
            if (aColumn.canSortAndFilter) this._state.filterableFields.push(aColumn);
        });
    }

    public orderByColumn(keyColumn: string): void {
        let hayQueOrdenar: boolean = false;
        let currColumn = this.props.columns.find(aColumn => aColumn.key === keyColumn);
        this.props.columns.forEach((aColumn: ISimpleListCol) => {
            if (aColumn.key === keyColumn) {
                hayQueOrdenar = true;
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

        if (hayQueOrdenar && currColumn) {
            if (currColumn.isNumeric)
                sortByNumber(this._state.dataFiltered, currColumn.field, currColumn.isSortedDescending)
            else
                sortByText(this._state.dataFiltered, currColumn.field, currColumn.isSortedDescending)
        } else
            sortByNumber(this._state.dataFiltered, 'key', false)
    }

    public filterByText(filterText: string, filterByTextAction: filterByTextActions, filterByTextField: ISimpleListCol): void {
        let filterData: boolean = false;
        let filterByTextActionLabel = getFilterByTextActionLabel(filterByTextAction);
        let filterFunction = filterByTextActionLabel.filterFunction;
        let fieldIsNumeric: boolean = (filterByTextField && filterByTextField.isNumeric) ? true : false;

        if (filterByTextActionLabel.notRequireText) {
            filterText = '';
            if (filterByTextAction != this.state.filterByTextAction) filterData = true;
            if (filterByTextField.field != this.state.filterByTextField!.field) filterData = true;
        } else if (filterText != this._state.filterText) {
            filterData = true;
        } else if (filterText.length > 0) {
            if (filterByTextAction != this.state.filterByTextAction) filterData = true;
            if (filterByTextField.field != this.state.filterByTextField!.field) filterData = true;
        }

        this._state.filterByTextAction = filterByTextAction;
        this._state.filterText = filterText;
        this._state.filterByTextField = filterByTextField;
        this._state.requireFilterText = (filterByTextActionLabel.notRequireText) ? false : true;
        // Quitar el órden de las columnas
        this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });

        if (filterData) {
            if (filterText.length > 0 || filterByTextActionLabel.notRequireText) {
                this._ItemsFilteredByText = this._allItems.filter(item => filterFunction(item, filterText, filterByTextField.field, fieldIsNumeric));
            } else {
                this._ItemsFilteredByText = this._allItems.slice(0);
            }
            this._state.dataFiltered = this._ItemsFilteredByText;
            this._state.filterGroupedText = '';
            this._state.groupedItems = this._makeGroupedList(this._ItemsFilteredByText);
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
            this._state.filterGroupedText = filterGroupedItem;
        }
    }

}

