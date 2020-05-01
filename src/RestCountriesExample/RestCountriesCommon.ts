import { ISlStyles } from 'src/lib/SimpleList/SimpleListColors';
import { ISimpleListCol } from 'src/lib/SimpleList/ISimpleListLib';
import { strings } from './loc/RestCountriesStrings';

/* Modelo */
export const URL_COUNTRIES = 'http://restcountries.eu/rest/v1/all';
export const URL_FLAGS = 'https://restcountries.eu/data/';
export const URL_RESTCOUNTRIES_SITE = 'https://restcountries.eu/';

export const URL_FLAGS_EXT = 'svg';
export const JSON_DATA = require('./recursos/countries.json');

export const URL_MAPS = 'https://maps.google.com/?q=';
export const URL_WIKIPEDIA_EN = 'https://en.wikipedia.org/wiki'
export const URL_WIKIPEDIA_ES = 'https://es.wikipedia.org/wiki'

export const DEFAULT_HEIGHT = 600;
export const DEFAULT_WIDTH = 1100;

export enum dataSources { fromURL, fromJson, fromJsonWithDelay };
export enum fetchResults { loading, loadedOk, loadedErr }

export const DATA_SOURCE_DEF = dataSources.fromJsonWithDelay;

export function getRestCountriesColumns(): ISimpleListCol[] {
    return (
        [
            // { titulo: "Key", campo: "key", width: 10 },
            // { titulo: "Bandera", campo: "flag", width: 10, isImage: true },
            { title: strings.field_Flag, field: "banderaUrl", width: 35, isImage: true },
            {
                title: strings.field_NativeName, field: "nativeName", width: 150, fieldUrl: "mapsPaisUrl", canSortAndFilter: true,
                headerTooltip: strings.click_ToSeeCountryInGoogleMaps,
            },
            {
                title: strings.field_EnglishName, field: "name", width: 150, fieldUrl: "wikiEnUrl", canSortAndFilter: true,
                headerTooltip: strings.click_ToGoWikipediaInEnglish,
            },
            {
                title: strings.field_SpanishName, field: "Pais", width: 150, fieldUrl: "wikiEsUrl", canSortAndFilter: true,
                headerTooltip: strings.click_ToGoWikipediaInSpanish
            },
            {
                title: strings.field_Capital, field: "capital", width: 120, fieldUrl: "mapsCapitalUrl", canSortAndFilter: true,
                headerTooltip: strings.click_ToSeeCapitalInGoogleMaps,
            },
            {
                title: strings.field_Continente, field: "region", width: 100, fieldUrl: "mapsContinenteUrl", canSortAndFilter: true, canGroup: true,
                headerTooltip: strings.click_ToSeeContinentInGoogleMaps,
            },
            {
                title: strings.field_Region, field: "subregion", width: 100, fieldUrl: "mapsRegionUrl", canSortAndFilter: true, canGroup: true,
                headerTooltip: strings.click_ToSeeregionInGoogleMaps,
            },
            {
                title: strings.field_Siglas, field: "alpha3Code", width: 50, fieldUrl: "banderaUrl", canSortAndFilter: true,
                headerTooltip: strings.click_ToSeeFlag
            },
            { title: strings.field_Idiomas, field: "idiomas", width: 100, canSortAndFilter: false },
            {
                title: strings.field_NumHusos, field: "numHusos", width: 50, fieldTooltip: 'husosTooltip', canSortAndFilter: true, isNumeric: true,
                headerTooltip: strings.click_ToViewTimeZones
            },
        ]
    )
}

export interface IRestCountriesStates {
    numRegs: number;
    fetchResult: fetchResults;
    fetchResultMessage: string;
    dataSource: dataSources;
    hiddenConfig: boolean;
    isCompactMode: boolean;
    language: string;
    theme: IRCTheme;
    hiddenInfo: boolean;
}

export interface IRestCountriesProps {
    language?: string;
    height?: number;
    width?: number;
};

export async function DownloadCountries(dataSource: dataSources): Promise<any[]> {
    let transformCountries = (data: any[]): any[] => {
        data.forEach((registro, indice) => {
            registro.key = indice.toString();
            registro.Pais = registro.translations.es;
            registro.numHusos = registro.timezones.length;
            registro.idiomas = (Array.isArray(registro.languages)) ? registro.languages.join(', ') : registro.languages;
            registro.husosTooltip = (Array.isArray(registro.timezones) ? registro.timezones.join(', ') : '');
            registro.wikiEnUrl = `${URL_WIKIPEDIA_EN}/${registro.name}`;
            registro.wikiEsUrl = `${URL_WIKIPEDIA_ES}/${registro.translations.es}`;
            registro.banderaUrl = `${URL_FLAGS}${registro.alpha3Code.toString().toLowerCase()}.${URL_FLAGS_EXT}`;
            registro.mapsPaisUrl = `${URL_MAPS}${registro.name}, country of ${registro.subregion}`;
            registro.mapsContinenteUrl = `${URL_MAPS}${registro.region}, continent`;
            registro.mapsRegionUrl = `${URL_MAPS}${registro.subregion}, region of ${registro.region}`;
            registro.mapsCapitalUrl = `${URL_MAPS}${registro.capital}, city of ${registro.name}`;
        })
        return (data);
    }

    switch (dataSource) {
        case dataSources.fromJsonWithDelay:
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(transformCountries(JSON_DATA));
                }, 400);
            })

        case dataSources.fromJson:
            return new Promise((resolve) => { resolve(transformCountries(JSON_DATA)); })

        case dataSources.fromURL:
            let res = await fetch(URL_COUNTRIES);
            if (!res) throw `La url ${URL_COUNTRIES}, no ha devuelto nada.`;
            let data = await res.json();
            return new Promise((resolve) => { resolve(transformCountries(data)); })

        default:
            throw "El Origen de Datos no es válido";
    }
}

export interface IRCTheme {
    key: string;
    slStyle: ISlStyles;
    name: string;
}

