export interface ISimpleListProps {
    hidden: boolean;
    data: any[];
    columns: ISimpleListCol[];
    labelItem: string;
    labelItems: string;
    listCompactMode?: boolean;
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

export interface groupedItem {
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
