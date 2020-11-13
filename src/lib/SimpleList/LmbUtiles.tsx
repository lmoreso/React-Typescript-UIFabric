import * as React from 'react';

export function StringsToJsx(props: { strings: string | string[] }): JSX.Element {
    if (!(props.strings && props.strings.length > 0))
        return (<span> </span>)
    else if (Array.isArray(props.strings))
        return (<span>{props.strings.map((aString: string, index) => <label>{(index) ? `<br />${aString}` : aString}</label>)}</span>)
    else
        return (<label>{props.strings}</label>)

}