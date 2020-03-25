import { ISimpleListCol } from './SimpleListCommon';

export interface ISimpleListUIFabricProps {
  hidden: boolean;
  datos: any[];
  columns: ISimpleListCol[];
  titulo: string;
}
