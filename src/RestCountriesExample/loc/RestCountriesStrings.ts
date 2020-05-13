export enum languagesSupportedIds { es = 'es', ca = 'ca', en = 'en', fr = 'fr' }

export interface ILanguagesSupported {
  id: languagesSupportedIds; 
  title: string;
}

export let languagesSupported: ILanguagesSupported[] = [
  {id: languagesSupportedIds.es, title: 'Español'},
  {id: languagesSupportedIds.ca, title: 'Català'},
  {id: languagesSupportedIds.en, title: 'English'},
  {id: languagesSupportedIds.fr, title: 'Français'},
]

export interface IRestCountriesStrings {
  header_HideInfo: string;
  header_ShowInfo: string;
  label_LoadFromRestcountries: string;
  click_ToViewTimeZones: string;
  click_ToSeeFlag: string;
  click_ToGoWikipediaInSpanish: string;
  click_ToGoWikipediaInEnglish: string;
  click_ToSeeCountryInGoogleMaps: string;
  click_ToSeeCapitalInGoogleMaps: string;
  click_ToSeeregionInGoogleMaps: string;
  click_ToSeeContinentInGoogleMaps: string;
  config_SelectColors: string;
  color_Blue: string;
  color_Green: string;
  color_Red: string;
  color_Grays: string;
  color_Yellow: string;
  color_Magenta: string;
  color_Cyan: string;
  config_SelectLanguage: string;
  header_ShowConfig: string;
  header_HideConfig: string;
  config_CompactMode: string;
  agradecimiento: string;
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

export let strings: IRestCountriesStrings;

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

export const DEFAULT_LANGUAGE = languagesSupportedIds.en;