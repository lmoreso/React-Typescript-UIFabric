import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISimpleListUIFabricProps } from './ISimpleListUIFabricProps';
import { copyAndSort, ISimpleListCol } from './SimpleListCommon';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
// import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

const LABEL_OPTION_SIN_CONTINENTE = 'Sin Continente';

const classNames = mergeStyleSets({
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  subWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
});

const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px'
  }
};

interface ISimpleListUIFabricStates {
  datos: any[];
  columns: IColumn[];
  isCompactMode: boolean;
  filterContinentOption: number | string;
}

interface IContinente {
  continente: string;
  numItems: number;
}


export class SimpleListUIFabric extends React.Component<ISimpleListUIFabricProps, ISimpleListUIFabricStates> {
  private _allItems: any[];
  private _filterName: string;
  private _continentOption: IDropdownOption[];
  private _continentFilter: IContinente[]
  // private _regions: { region: string; continent: string }[];

  private _getContinentes(): number {
    let numContinentes: number = 0;
    let numPaises: number = 0;
    this._continentFilter = new Array<IContinente>();
    // Se cuentan el nº de paises por cada continente
    this._allItems.forEach(unPais => {
      let region = (unPais.region) ? unPais.region : LABEL_OPTION_SIN_CONTINENTE;
      let nouContinent = this._continentFilter.find((unContinent) => (unContinent.continente === region));
      if (nouContinent) {
        nouContinent.numItems++;
      } else {
        this._continentFilter.push({ continente: region, numItems: 1 });
        numContinentes++;
      }
      numPaises++;
    })
    // Creamos el array de opciones para el combo (Dropdown)
    this._continentOption = new Array<IDropdownOption>();
    this._continentOption.push({ key: -1, text: `Todos los Continentes (${numPaises})` });
    this._continentFilter.forEach((unContinente, indice) => { this._continentOption.push({ key: indice, text: `${unContinente.continente} (${unContinente.numItems})` }) });

    console.log('Array de Continentes', this._continentOption);
    return (numContinentes);
  }

  public constructor(props: ISimpleListUIFabricProps) {
    super(props);
    this._allItems = this.props.datos.slice(0);
    this._filterName = "";
    this._getContinentes();
    this.state = {
      datos: this._allItems,
      columns: this._procesaColumnas(this.props.columns),
      isCompactMode: false,
      filterContinentOption: -1,
    }
  }

  private _filter(filterContinentOption: string | number): void {
    let datos = this._allItems;

    if (this._filterName)
      datos = datos.filter(unPais => {
        if (unPais.name && unPais.name.toLowerCase().indexOf(this._filterName.toLowerCase()) > -1) return (true);
        if (unPais.nativeName && unPais.nativeName.toLowerCase().indexOf(this._filterName.toLowerCase()) > -1) return (true);
        if (unPais.translations.es && unPais.translations.es.toLowerCase().indexOf(this._filterName.toLowerCase()) > -1) return (true);
        return (false);
      })

    if (filterContinentOption > -1)
      datos = datos.filter(unPais => {
        if (unPais.region && unPais.region.toLowerCase() == this._continentFilter[filterContinentOption].continente.toLowerCase())
          return (true);
        if (!unPais.region && this._continentFilter[filterContinentOption].continente == LABEL_OPTION_SIN_CONTINENTE)
          return (true);
        return (false);
      })

    // if (this._filterRegion)
    //   datos = datos.filter(unPais => {
    //     if (unPais.subregion && unPais.subregion.toLowerCase().indexOf(this._filterRegion.toLowerCase()) > -1) return (true);
    //     return (false);
    //   })


    this.setState({ datos, filterContinentOption })

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
        this.state.datos.slice(0)
    });
  };

  private _onChangeCompactMode = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
    this.setState({ isCompactMode: checked });
  };

  private _onChangeText = (text: string): void => {
    this._filterName = text;
    this._filter(this.state.filterContinentOption);
  };

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      return (
        <div>
          <h2>{this.props.titulo}</h2>
          <div>
            <div className={classNames.controlWrapper}>
              <Toggle
                label="Enable compact mode"
                checked={this.state.isCompactMode}
                onChange={this._onChangeCompactMode}
                onText="Compact"
                offText="Normal"
                styles={controlStyles}
              />
              {/* <TextField label="Filter by name:" onChange={this._onChangeText} styles={controlStyles} /> */}
              {/* <div className={classNames.subWrapper}> */}
              {/* <Label htmlFor='textFieldId' styles={controlStyles}>Filter by name: </Label> */}
              <SearchBox
                id='textFieldId'
                placeholder="Filter by name"
                // onFocus={() => console.log('onFocus called')}
                // onBlur={() => console.log('onBlur called')}
                // onChange={(newValue) => console.log(`onChange called: ${newValue}`)}
                // onSearch={this._onChangeText}
                onChange={this._onChangeText}
                styles={controlStyles}
              />
              {/* </div> */}
              <Dropdown
                // defaultSelectedKey={-1}
                selectedKey={this.state.filterContinentOption}
                onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
                  console.log(`Cambiado Filtro Continente a ${item.key} (${item.text})`);
                  console.log('_continentOption', this._continentOption);
                  console.log('_continentFilter', this._continentFilter);
                  this._filter(item.key);
                }}
                placeholder="Select an Continent"
                options={this._continentOption}
                styles={controlStyles}
                style={{ width: 250 }}
              />
              <Label styles={controlStyles}>{`Se están mostrando ${this.state.datos.length} paises.`}</Label>
            </div>
            <DetailsList
              items={this.state.datos}
              compact={this.state.isCompactMode}
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
