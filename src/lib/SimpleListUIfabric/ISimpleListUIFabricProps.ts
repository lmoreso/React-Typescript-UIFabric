import { ISimpleListCol } from './SimpleListCommon';

export interface ISimpleListUIFabricProps {
  hidden: boolean;
  data: any[];
  columns: ISimpleListCol[];
  title: string;
  labelItem: string;
  fieldsTextFilter: string[];
  fieldsDropdownFilter?: {labelItem: string; fields: string[]}[];
  listCompactMode?: boolean;
  showToggleCompactMode?: boolean;
}
