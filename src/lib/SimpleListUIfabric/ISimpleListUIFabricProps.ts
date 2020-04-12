import { ISimpleListProps } from './SimpleListCommon';

export interface ISimpleListUIFabricProps extends ISimpleListProps {
  fieldDropdownFilter?: { valueIfNull: string; field: string; valueNoFilter: string };
  showToggleCompactMode?: boolean;
  fixedHeader?: boolean;
  showLabel?: boolean;
}


