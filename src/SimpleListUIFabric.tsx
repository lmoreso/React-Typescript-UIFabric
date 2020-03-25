import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISimpleListUIFabricProps } from './ISimpleListUIFabricProps';
import { copyAndSort, ISimpleListCol } from './SimpleListCommon';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';

interface ISimpleListUIFabricStates {
  datos: any[];
  columns: IColumn[];
}

export class SimpleListUIFabric extends React.Component<ISimpleListUIFabricProps, ISimpleListUIFabricStates> {
  public constructor(props: ISimpleListUIFabricProps) {
    super(props);
    this.state = {
      datos: this.props.datos.slice(0),
      columns: this._procesaColumnas(this.props.columns),
    }
  }

  private _procesaColumnas(simpleListCols: ISimpleListCol[]): IColumn[] {
    let columns: IColumn[] = new Array<IColumn>();

    simpleListCols.forEach((unaColumna: ISimpleListCol, indice) => {
      let laColumna: IColumn = {
        key: indice.toString(),
        name: unaColumna.titulo,
        fieldName: unaColumna.campo,
        minWidth: unaColumna.width * 3,
        // maxWidth: unPais.width * 2,
        // isRowHeader: true,
        isResizable: true,
        columnActionsMode: ColumnActionsMode.clickable,
        // isSorted: true,
        // isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        // onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      };
      if (unaColumna.campoUrl || unaColumna.campoTooltip) {
        if (unaColumna.campoUrl && unaColumna.campoTooltip) {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(unaColumna.campoTooltip) ? unaColumna.campoTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Link hRef={item[(unaColumna.campoUrl) ? unaColumna.campoUrl : 0]} target='_blank'>
                  {item[unaColumna.campo]}
                </Link>
              </TooltipHost>
            );
          }
        } else if (unaColumna.campoTooltip) {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(unaColumna.campoTooltip) ? unaColumna.campoTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                {item[unaColumna.campo]}
              </TooltipHost>
            );
          }
        } else {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(unaColumna.campoUrl) ? unaColumna.campoUrl : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <a href={item[(unaColumna.campoUrl) ? unaColumna.campoUrl : 0]} target='_blank'>
                  {item[unaColumna.campo]}
                </a>
              </TooltipHost>
            )
          }
        }
      }
      columns.push(laColumna);
    });

    return (columns);
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const newColumns: IColumn[] = this.state.columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    let hayQueOrdenar: boolean = true;
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        if (!currColumn.isSorted) {
          currColumn.isSorted = true;
          currColumn.isSortedDescending = false
        } else if (!currColumn.isSortedDescending) {
          currColumn.isSortedDescending = true
        } else {
          currColumn.isSorted = false;
          hayQueOrdenar = false;
        }
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    this.setState({
      columns: newColumns,
      datos: (hayQueOrdenar) ?
        copyAndSort(this.state.datos, currColumn.fieldName!, currColumn.isSortedDescending)
        :
        this.props.datos.slice(0)
    });
  };

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      return (
        <div>
          <h2>{this.props.titulo}</h2>
          <div>
            <DetailsList
              items={this.state.datos}
              compact={true}
              columns={this.state.columns}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              // disableSelectionZone= {true}
              selectionMode={SelectionMode.none}
              onColumnHeaderClick={this._onColumnClick}
            // isHeaderVisible={true}
            />
          </div>
        </div>
      );
    }
  }
}
