import { ISimpleListProps } from './ISimpleListLib';
import { ISlStyles } from './SimpleListHtmlStyles';

export interface ISimpleListHtmlProps extends ISimpleListProps {
    hidden: boolean;
    isCompactMode?: boolean;
    showToggleCompactMode?: boolean;
    showLabel?: boolean;
    heightInPx?: number;
    theme?: ISlStyles;
}


