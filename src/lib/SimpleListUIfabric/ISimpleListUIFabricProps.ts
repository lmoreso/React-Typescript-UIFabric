import { ISimpleListProps } from './ISimpleListLib';

export interface ISimpleListUIFabricProps extends ISimpleListProps {
  hidden: boolean;
  listCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  showLabel?: boolean;
  fixedHeader?: boolean;
}


