import { ISimpleListCol } from './ISimpleListLib';

export interface ISimpleListUIFabricProps {
  data: any[];
  columns: ISimpleListCol[];
  labelItem: string;
  labelItems: string;
  fieldsTextFilter?: string[];
  fieldDropdownFilter?: { valueIfNull: string; field: string; valueNoFilter: string };
  hidden: boolean;
  listCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  showLabel?: boolean;
  fixedHeader?: boolean;
}


