
export interface IExtractWikiProps {
    textToSearch: string;
    rootUrl?: string;
    numPagesToSearch?: number;
    plainText?: boolean;
    numChars?: number;
    numSentences?: number,
    imageSize?: number,
}

export const EXTRACT_WIKI_DEFAULTS: IExtractWikiProps = {
    textToSearch: 'Guernica, pintura de Picasso',
    rootUrl: 'https://es.wikipedia.org',
    numPagesToSearch: 1,
    plainText: true,
    numChars: 300,
    numSentences: 0,
    imageSize: 250,
}

export interface IWikiExtractPage {
    pageId: string;
    index: number;
    textOrHtml: string;
    title: string;
    link: string;
    image?: {
        url: string;
        width: number;
        height: number;
    };
}

export interface IWikiExtractResult {
    queryProps: IExtractWikiProps;
    numPages: number;
    extractPages?: Array<IWikiExtractPage>;
    textError?: string;
    queryUrl?: string;
}

export async function ExtractWiki(props: IExtractWikiProps): Promise<IWikiExtractResult> {
    let pagesResult: IWikiExtractResult = {
        queryProps: { ...props },
        numPages: 0,
        textError: '',
    }

    if (!props.textToSearch || props.textToSearch.length <= 0) {
        pagesResult.textError = 'No se ha proporcionado ningún texto que buscar en la Wikipedia';
    } else {
        // Componer la query
        pagesResult.queryUrl = `${props.rootUrl}/w/api.php?action=query&generator=search`
            + `&gsrlimit=${(props.numPagesToSearch) ? props.numPagesToSearch : 1}`
            + `&gsrsearch=${props.textToSearch}`
            + `&prop=extracts|pageimages&format=json`
            + `&exintro=&pithumbsize=${(props.imageSize && props.imageSize > 50) ? props.imageSize : 250}`
        if (props.numChars && props.numChars > 0)
            pagesResult.queryUrl += `&exchars=${props.numChars}`;
        else if (props.numSentences && props.numSentences > 0)
            pagesResult.queryUrl += `&exsentences=${props.numSentences}`;
        if (props.plainText)
            pagesResult.queryUrl += `&explaintext=`;
        pagesResult.queryUrl += `&origin=*`;

        // Realizar la Query
        let resp: Response = await fetch(pagesResult.queryUrl);
        let dataWiki = await resp.json();

        // Convertir la respuesta en array de paginas
        let extractPages = new Array<IWikiExtractPage>();
        let pagesId = Object.keys(dataWiki.query.pages);
        pagesId.forEach((aPageId) => {
            let thePage: IWikiExtractPage = {
                pageId: aPageId,
                textOrHtml: dataWiki.query.pages[aPageId].extract,
                title: dataWiki.query.pages[aPageId].title,
                link: `${props.rootUrl}/wiki/${dataWiki.query.pages[aPageId].title}`,
                index: dataWiki.query.pages[aPageId].index,
                image: (!dataWiki.query.pages[aPageId].thumbnail) ? undefined :
                    {
                        url: dataWiki.query.pages[aPageId].thumbnail.source,
                        height: dataWiki.query.pages[aPageId].thumbnail.height,
                        width: dataWiki.query.pages[aPageId].thumbnail.width,
                    }
            }
            extractPages.push(thePage);
        });
        // Ordenar el array de páginas por relevancia (no vienen ordenados)
        pagesResult.extractPages = extractPages.sort((a: IWikiExtractPage, b: IWikiExtractPage) => (a.index > b.index) ? 1 : -1);
        pagesResult.numPages = pagesResult.extractPages.length;
    }

    return (Promise.resolve(pagesResult));
}
