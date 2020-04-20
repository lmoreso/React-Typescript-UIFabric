export enum languagesSupported { es = 'es', ca = 'ca', en='en', fr='fr' }

export interface ISimpleListStrings {
    model_Loading: string;
    title_App: string;
    label_Paises: string;
    label_Pais: string;
    field_NumHusos: string;
    field_Idiomas: string;
    field_Siglas: string;
    field_Region: string;
    field_Continente: string;
    field_Capital: string;
    field_Flag: string;
    field_NativeName: string;
    field_EnglishName: string;
    field_SpanishName: string;
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