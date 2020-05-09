import { initStrings, strings, detectLanguage, } from './loc/SimpleListStrings';
import { languagesSupportedIds } from 'src/RestCountriesExample/loc/RestCountriesStrings';

export interface ISimpleListProps {
    data: any[];
    columns: ISimpleListCol[];
    labelItem: string;
    labelItems: string;
    language?: string;
}

export enum filterByTextActionsId {
    startBy = 'startBy', contains = 'contains', finishBy = 'finishBy',
    greater = 'greater', greaterOrEqual = 'greaterOrEqual', equal = 'equal',
    smallerOrEqual = 'smallerOrEqual', smaller = 'smaller', nullValue = 'nullValue',
    notNull = 'notNull',
}

export interface filterByTextAction {
    action: filterByTextActionsId;
    title: string;
    filterFunction: (item: any, textFilter: string, field: string, isNumeric: boolean) => boolean;
    notRequireText?: boolean;
}

export function filterByTextActionsList(): filterByTextAction[] {
    return ([
        {
            action: filterByTextActionsId.startBy, title: strings.filterAction_StartsBy,
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
                (item[field] && item[field].toString().trim().toLowerCase().indexOf(textFilter.toLowerCase()) == 0) ? true : false,
        },
        {
            action: filterByTextActionsId.contains, title: strings.filterAction_Contains,
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
                (item[field] && item[field].toString().trim().toLowerCase().indexOf(textFilter.toLowerCase()) > -1) ? true : false,
        },
        {
            action: filterByTextActionsId.finishBy, title: strings.filterAction_FinishBy,
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
                (!item[field] || textFilter.length <= 0) ? false : (item[field].toString().trim().slice(-textFilter.length) == textFilter) ? true : false,
        },
        {
            action: filterByTextActionsId.greater, title: '>',
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
                let numberFilter: number = parseInt(textFilter);
                if (isNaN(numberFilter) || !isNumeric) {
                    return ((textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() > textFilter.toLowerCase()) ? true : false);
                } else {
                    return ((item[field] && parseInt(item[field]) > numberFilter) ? true : false);
                }
            },
        },
        {
            action: filterByTextActionsId.greaterOrEqual, title: '>=',
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
                let numberFilter: number = parseInt(textFilter);
                if (isNaN(numberFilter) || !isNumeric) {
                    return ((textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() >= textFilter.toLowerCase()) ? true : false);
                } else {
                    return ((item[field] && parseInt(item[field]) >= numberFilter) ? true : false);
                }
            },
        },
        {
            action: filterByTextActionsId.equal, title: '=',
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
                let numberFilter: number = parseInt(textFilter);
                if (isNaN(numberFilter) || !isNumeric) {
                    return ((textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() == textFilter.toLowerCase()) ? true : false);
                } else {
                    return ((item[field] && parseInt(item[field]) == numberFilter) ? true : false);
                }
            },
        },
        {
            action: filterByTextActionsId.smallerOrEqual, title: '<=',
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
                let numberFilter: number = parseInt(textFilter);
                if (isNaN(numberFilter) || !isNumeric) {
                    return ((textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() <= textFilter.toLowerCase()) ? true : false);
                } else {
                    return ((item[field] && parseInt(item[field]) <= numberFilter) ? true : false);
                }
            },
        },
        {
            action: filterByTextActionsId.smaller, title: '<',
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean => {
                let numberFilter: number = parseInt(textFilter);
                if (isNaN(numberFilter) || !isNumeric) {
                    return ((textFilter.length > 0 && item[field] && item[field].toString().trim().toLowerCase() < textFilter.toLowerCase()) ? true : false);
                } else {
                    return ((item[field] && parseInt(item[field]) < numberFilter) ? true : false);
                }
            },
        },
        {
            action: filterByTextActionsId.nullValue, title: strings.filterAction_nullValue,
            notRequireText: true,
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
                (item[field] == null || item[field].toString().trim() == '') ? true : false,
        },
        {
            action: filterByTextActionsId.notNull, title: strings.filterAction_notNull,
            notRequireText: true,
            filterFunction: (item: any, textFilter: string, field: string, isNumeric?: boolean): boolean =>
                (item[field] && item[field].toString().trim().length > 0) ? true : false,
        },
    ])
}

function getDefaultFilterByTextAction() {
    return filterByTextActionsList()[0];
}

function getFilterByTextActionLabel(action: filterByTextActionsId): filterByTextAction {
    let theActionLabel = filterByTextActionsList().find((anActionLabel) => (action === anActionLabel.action) ? true : false);
    return ((theActionLabel) ? theActionLabel : getDefaultFilterByTextAction());
};

export interface ISimpleListCol {
    key?: string;
    title: string;
    field: string;
    width: number;
    headerTooltip?: string;
    fieldTooltip?: string;
    fieldUrl?: string;
    isImage?: boolean;
    canSortAndFilter?: boolean;
    isSorted?: boolean;
    isSortedDescending?: boolean;
    canGroup?: boolean;
    isNumeric?: boolean;
}

export interface IGroupedCol extends ISimpleListCol {
    valueIfNull: string;
    valueNoFilter: string;
    numItems: number;
}

export interface IGroupedItem {
    key: number | string;
    value: string;
    numOcurrences: number;
}

export interface ISimpleListStates {
    dataFiltered: any[];
    groupableFields: IGroupedCol[];
    filterableFields: ISimpleListCol[];
    filterText: string;
    filterByTextActionId: filterByTextActionsId;
    filterByTextField: ISimpleListCol | undefined;
    requireFilterText: boolean;
    groupedItems: IGroupedItem[];
    filterByGroupField: IGroupedCol | undefined;
    filterByGroupText: string;
    language: languagesSupportedIds;
}

export class SimpleList {
    private _allItems: any[];
    private _ItemsFilteredByText: any[];
    public get numItemsFilteredByText(): number {
        return (this._ItemsFilteredByText.length);
    };
    private props: ISimpleListProps;
    private readonly _state: ISimpleListStates;
    public get state() {
        return (this._state);
    };
    public get columns() {
        return (this.props.columns);
    };

    public constructor(props: ISimpleListProps) {
        this.props = props;
        this._allItems = props.data.slice(0);
        this._ItemsFilteredByText = this._allItems.slice(0);

        // cargar traducciones
        let langDetected = detectLanguage(this.props.language);
        initStrings(langDetected);

        // Inicializar estados
        this._state = {
            dataFiltered: this._allItems,
            filterByGroupText: '',
            filterText: '',
            filterByGroupField: undefined,
            groupedItems: [],
            groupableFields: [],
            filterableFields: [],
            filterByTextActionId: getDefaultFilterByTextAction().action,
            filterByTextField: undefined,
            requireFilterText: (getDefaultFilterByTextAction().notRequireText) ? false : true,
            language: langDetected,
        }

        this.props.columns.forEach((aColumn: ISimpleListCol) => {
            if (aColumn.canGroup)
                this._state.groupableFields.push({ ...aColumn, valueIfNull: `${strings.groupWithout} ${aColumn.title}`, valueNoFilter: strings.groupAll, numItems: 0 });
            if (aColumn.canSortAndFilter)
                this._state.filterableFields.push(aColumn);
        });

        if (this._state.groupableFields.length > 0) {
            this._state.filterByGroupField = this._state.groupableFields[0];
            this._makeGroupedItemsList();
        }

    }

    public orderByColumn(keyColumn: string): void {
        let mustOrder: boolean = false;
        let currColumn = this.props.columns.find(aColumn => aColumn.key === keyColumn);
        this.props.columns.forEach((aColumn: ISimpleListCol) => {
            if (aColumn.key === keyColumn) {
                mustOrder = true;
                if (!aColumn.isSorted) {
                    aColumn.isSorted = true;
                    aColumn.isSortedDescending = false
                } else if (!aColumn.isSortedDescending) {
                    aColumn.isSortedDescending = true
                } else {
                    aColumn.isSorted = false;
                    mustOrder = false;
                }
            } else {
                aColumn.isSorted = false;
                aColumn.isSortedDescending = true;
            }
        });

        if (mustOrder && currColumn) {
            if (currColumn.isNumeric)
                this._state.dataFiltered = sortByNumber(this._state.dataFiltered, currColumn.field, currColumn.isSortedDescending)
            else
                this._state.dataFiltered = sortByText(this._state.dataFiltered, currColumn.field, currColumn.isSortedDescending)
        } else
            this._state.dataFiltered = sortByNumber(this._state.dataFiltered, 'key', false)
    }

    public filterByText(filterText: string, filterByTextActionId: filterByTextActionsId, filterByTextField: ISimpleListCol): void {
        let mustFilter: boolean = false;
        let filterByTextActionLabel = getFilterByTextActionLabel(filterByTextActionId);
        let filterFunction = filterByTextActionLabel.filterFunction;
        let fieldIsNumeric: boolean = (filterByTextField && filterByTextField.isNumeric) ? true : false;
        filterText = filterText.trim();

        if (filterByTextActionLabel.notRequireText) {
            filterText = '';
            if (filterByTextActionId != this.state.filterByTextActionId) mustFilter = true;
            if (!mustFilter && filterByTextField && filterByTextField.field != this.state.filterByTextField!.field) mustFilter = true;
        } else if (filterText != this._state.filterText
            || (filterText.length == 0 && getFilterByTextActionLabel(this.state.filterByTextActionId).notRequireText)) {
            mustFilter = true;
        } else if (filterText.length > 0) {
            if (filterByTextActionId != this.state.filterByTextActionId) mustFilter = true;
            if (filterByTextField.field != this.state.filterByTextField!.field) mustFilter = true;
        }

        this._state.filterByTextActionId = filterByTextActionId;
        this._state.filterText = filterText;
        this._state.filterByTextField = filterByTextField;
        this._state.requireFilterText = (filterByTextActionLabel.notRequireText) ? false : true;
        // Quitar el órden de las columnas
        this.props.columns.forEach((aColumn: ISimpleListCol) => { aColumn.isSorted = false; aColumn.isSortedDescending = true });

        if (mustFilter) {
            if (filterText.length > 0 || filterByTextActionLabel.notRequireText) {
                this._ItemsFilteredByText = this._allItems.filter(item => filterFunction(item, filterText, filterByTextField.field, fieldIsNumeric));
            } else {
                this._ItemsFilteredByText = this._allItems.slice(0);
            }
            this._state.dataFiltered = this._ItemsFilteredByText;
            this._state.filterByGroupText = '';
            this._makeGroupedItemsList();
        }
    }

    public makeGroupedItemsList(groupedFieldTitle: string): void {
        let groupedField = this._state.groupableFields.find(aGroup => (aGroup.field == groupedFieldTitle));
        this._state.filterByGroupField = groupedField;
        this._makeGroupedItemsList();
    }

    private _makeGroupedItemsList(): void {
        let data = this._ItemsFilteredByText;
        let newGroupedItem = new Array<IGroupedItem>();

        if (this._state.filterByGroupField) {
            let field = this._state.filterByGroupField.field;
            let valueIfNull = `${strings.groupWithout} ${this._state.filterByGroupField.title}`;
            // Calculamos la lista de Items agrupados
            data.forEach((aRow, index) => {
                let value = (aRow[field]) ? aRow[field] : valueIfNull;
                let newValue = newGroupedItem.find((aGroup) => (aGroup.value === value));
                if (newValue) {
                    newValue.numOcurrences!++;
                } else {
                    newGroupedItem.push({ key: index, value, numOcurrences: 1 });
                    // numGroups++;
                }
            })
            // Ordenamos la lista de Items agrupados
            newGroupedItem.sort((a, b) => (a.value > b.value) ? 1 : -1);
            this._state.groupedItems = newGroupedItem;
        }
        // deshacemos el filtro anterior de grupos, si lo hubiera
        this._state.filterByGroupText = '';
        this._state.dataFiltered = this._ItemsFilteredByText;
    }

    public filterByGroup(filterGroupedItem: string): void {
        if (this._state.filterByGroupField) {
            let data = this._ItemsFilteredByText;
            let fieldValue = (filterGroupedItem == this._state.filterByGroupField.valueIfNull) ? '' : filterGroupedItem;

            if (filterGroupedItem != this._state.filterByGroupField.valueNoFilter) {
                let field = this._state.filterByGroupField.field;
                data = data.filter(anItem => {
                    return (anItem[field] == fieldValue);
                });
            }
            this._state.dataFiltered = data;
            this._state.filterByGroupText = filterGroupedItem;
        }
    }
}

export function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export function copyAndSortByKey<T>(items: T[], isSortedDescending?: boolean): T[] {
    const key = 'key';
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[key]) < parseInt(b[key]) : parseInt(a[key]) > parseInt(b[key])) ? 1 : -1));
}

function sortByText<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    items.sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    return items;
}

function sortByNumber<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    items.sort((a: T, b: T) => ((isSortedDescending ? parseInt(a[columnKey]) < parseInt(b[columnKey]) : parseInt(a[columnKey]) > parseInt(b[columnKey])) ? 1 : -1));
    return items;
}

