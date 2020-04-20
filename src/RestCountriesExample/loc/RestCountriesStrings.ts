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

export function detectLanguage(languagePrefered?: string): languagesSupported {
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
    
export const DEFAULT_LANGUAGE = languagesSupported.en;