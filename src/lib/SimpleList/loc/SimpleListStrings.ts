
export enum languagesSupportedIds { es = 'es', ca = 'ca', en='en', fr='fr' }

export interface ISimpleListStrings {
    config_CompactMode: string;
    order_ClickToOrder: string;
    order_CantOrder: string;
    groupAll: string;
    groupWithout: string;
    filterAction_notNull: string;
    filterAction_nullValue: string;
    filterAction_FinishBy: string;
    filterAction_Contains: string;
    filterAction_StartsBy: string;
    filterBy: string;
}

export let strings: ISimpleListStrings;

export function initStrings(ln: languagesSupportedIds): void {
    strings = require(`./${ln}`).strings;
}

export function stringToLanguagesSupported(language?: string): languagesSupportedIds | undefined {
    if (language) {
        language = language.substring(0, 2);
        for (let ln in languagesSupportedIds) {
            if (ln == language) return (ln as languagesSupportedIds);
        }
    }
    return (undefined);
}

export const DEFAULT_LANGUAGE = languagesSupportedIds.en;

export function detectLanguage(languagePrefered?: string): languagesSupportedIds {
    // Detectar si el lenguaje preferido está implementado
    let languageSelected = stringToLanguagesSupported(languagePrefered);

    // si ho viene un lenguaje preferido, miramos si tenemos implementado el idioma preferente del navegador
    if (!languageSelected)
        languageSelected = stringToLanguagesSupported(navigator.language);

    // para terminar, miramos si tenemos implementado alguno de los idiomas secundarios del navegador
    if (!languageSelected)
        navigator.languages.forEach(aLn => {
            if (!languageSelected) languageSelected = stringToLanguagesSupported(aLn);
        });

    return ((languageSelected) ? languageSelected : DEFAULT_LANGUAGE);
}

