export enum languagesSupported { es = 'es', ca = 'ca', en='en', fr='fr' }

export interface ISimpleListStrings {
    order_ClickToOrder: any;
    order_CantOrder: string;
    groupAll: string;
    groupWithout: any;
    filterAction_notNull: string;
    filterAction_nullValue: string;
    filterAction_FinishBy: string;
    filterAction_Contains: string;
    filterAction_StartsBy: string;
    filterBy: string;
}

export let strings: ISimpleListStrings;

export function initStrings(ln: languagesSupported): void {
    strings = require(`./${ln}`).strings;
    console.log('initStrings', strings);
}

export function stringToLanguagesSupported(language?: string): languagesSupported | undefined {
    if (language) {
        language = language.substring(0, 2);
        for (let ln in languagesSupported) {
            if (ln == language) return (ln as languagesSupported);
        }
    }
    return (undefined);
}

export const DEFAULT_LANGUAGE = languagesSupported.en;