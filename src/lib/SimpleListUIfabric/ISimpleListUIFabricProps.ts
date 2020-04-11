import { ISimpleListProps } from './SimpleListCommon';

export interface ISimpleListUIFabricProps extends ISimpleListProps {
  fieldsTextFilter: string[];
  fieldDropdownFilter: { valueIfNull: string; field: string; valueNoFilter: string };
  listCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  fixedHeader?: boolean;
  showLabel?: boolean;
}


