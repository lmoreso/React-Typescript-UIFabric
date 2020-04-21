import { ISimpleListProps } from './ISimpleListLib';

export interface ISimpleListHtmlProps extends ISimpleListProps {
    hidden: boolean;
    isCompactMode?: boolean;
    showToggleCompactMode?: boolean;
    showLabel?: boolean;
    backgroundColorHeader?: string;
    heightInPx?: number;
}


