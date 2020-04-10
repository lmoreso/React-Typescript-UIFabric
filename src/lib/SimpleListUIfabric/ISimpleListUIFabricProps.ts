import { ISimpleListCol } from './SimpleListCommon';

export interface ISimpleListUIFabricProps {
  hidden: boolean;
  data: any[];
  columns: ISimpleListCol[];
  labelItem: string;
  labelItems: string;
  fieldsTextFilter: string[];
  fieldDropdownFilter: {valueIfNull: string; field: string; valueNoFilter: string}; 
  // fieldsDropdownFilter?: {valueIfNull: string; fields: string}[];  // en construcción
  listCompactMode?: boolean;
  showToggleCompactMode?: boolean;
  fixedHeader?: boolean;
  showLabel?: boolean;
}
