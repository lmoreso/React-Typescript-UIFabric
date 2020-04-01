import * as React from 'react';
import { DetailsList, /* DetailsListLayoutMode, */ IColumn, SelectionMode, ColumnActionsMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISimpleListUIFabricProps } from './ISimpleListUIFabricProps';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { copyAndSort, ISimpleListCol, copyAndSortByKey } from './SimpleListCommon';


const LABEL_OPTION_SIN_CONTINENTE = 'Sin Continente';
const LABEL_OPTION_SIN_REGION = 'Sin Región';

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
  filterRegionOption: number | string;
}

interface IContinente {
  continente: string;
  numItems: number;
}

interface IRegion {
  continente: string;
  region: string;
  numItems: number;
}


export class SimpleListUIFabric extends React.Component<ISimpleListUIFabricProps, ISimpleListUIFabricStates> {
  private _allItems: any[];
  private _filterText: string;
  private _continentOption: IDropdownOption[];
  private _continentFilter: IContinente[];
  private _regionOption: IDropdownOption[];
  private _regionFilter: IRegion[];

  public constructor(props: ISimpleListUIFabricProps) {
    super(props);
    this._allItems = this.props.data.slice(0);
    this._filterText = "";
    this._getContinentes();
    this.state = {
      datos: this._allItems,
      columns: this._procesaColumnas(this.props.columns),
      isCompactMode: (this.props.listCompactMode) ? true : false,
      filterContinentOption: -1,
      filterRegionOption: -1,
    }
  }

  private _getContinentes(): number {
    let numContinentes: number = 0;
    let numPaises: number = 0;
    this._continentFilter = new Array<IContinente>();
    this._regionFilter = new Array<IRegion>();
    // Se cuentan el nº de paises por cada continente
    this._allItems.forEach(unPais => {
      numPaises++;
      // Lista de Continentes
      let continente = (unPais.region) ? unPais.region : LABEL_OPTION_SIN_CONTINENTE;
      let nouContinent = this._continentFilter.find((unContinent) => (unContinent.continente === continente));
      if (nouContinent) {
        nouContinent.numItems++;
      } else {
        this._continentFilter.push({ continente: continente, numItems: 1 });
        numContinentes++;
      }
      // Lista de Regiones
      let region = (unPais.subregion) ? unPais.subregion : LABEL_OPTION_SIN_REGION;
      let nuevaRegion = this._regionFilter.find((unaRegion) => (unaRegion.continente === continente && unaRegion.region === region));
      if (nuevaRegion) {
        nuevaRegion.numItems++;
      } else {
        this._regionFilter.push({ continente: continente, region: region, numItems: 1 });
      }
    })
    // Creamos el array de opciones para el combo (Dropdown) de Continentes
    this._continentOption = new Array<IDropdownOption>();
    this._continentOption.push({ key: -1, text: `Todos los Continentes (${numPaises})` });
    this._continentFilter.sort((a, b) => (a.continente > b.continente) ? 1 : -1);
    this._continentFilter.forEach((unContinente, indice) => { this._continentOption.push({ key: indice, text: `${unContinente.continente} (${unContinente.numItems})` }) });

    // Creamos el array de opciones para el combo (Dropdown) de Continentes
    this._regionOption = new Array<IDropdownOption>();
    this._regionOption.push({ key: -1, text: `Todas las Regiones (${numPaises})` });
    this._regionFilter.sort((a, b) => (`${a.continente} - ${a.region}` > `${b.continente} - ${b.region}`) ? 1 : -1);
    this._regionFilter.forEach((unaRegion, indice) => { this._regionOption.push({ key: indice, text: `${unaRegion.continente} - ${unaRegion.region} (${unaRegion.numItems})` }) });

    console.log('Array de Continentes', this._continentFilter);
    console.log('Array de Regiones', this._regionFilter);
    return (numContinentes);
  }

  private _filter(): void {
    let data = this._allItems;

    if (this._filterText && this._filterText.length > 0 && this.props.fieldsTextFilter && this.props.fieldsTextFilter.length > 0) {
      data = data.filter(item => {
        let numFileds = 0;
        this.props.fieldsTextFilter.forEach((field) => {
          if (item[field] && item[field].toLowerCase().indexOf(this._filterText.toLowerCase()) > -1) numFileds++;
        });
        return ((numFileds > 0));
      });
    }
      /*
        if (filterRegionOption > -1) {
          datos = datos.filter(unPais => {
            if (unPais.region && unPais.region.toLowerCase() == this._regionFilter[filterRegionOption].continente.toLowerCase()) {
              if (unPais.subregion && unPais.subregion.toLowerCase() == this._regionFilter[filterRegionOption].region.toLowerCase())
                return (true);
              if (!unPais.subregion && this._regionFilter[filterRegionOption].region == LABEL_OPTION_SIN_REGION)
                return (true);
            }
            if (!unPais.region && this._regionFilter[filterRegionOption].continente == LABEL_OPTION_SIN_CONTINENTE) {
              if (unPais.subregion && unPais.subregion.toLowerCase() == this._regionFilter[filterRegionOption].region.toLowerCase())
                return (true);
              if (!unPais.subregion && this._regionFilter[filterRegionOption].region == LABEL_OPTION_SIN_REGION)
                return (true);
            }
            return (false);
          });
        } else if (filterContinentOption > -1) {
          datos = datos.filter(unPais => {
            if (unPais.region && unPais.region.toLowerCase() == this._continentFilter[filterContinentOption].continente.toLowerCase())
              return (true);
            if (!unPais.region && this._continentFilter[filterContinentOption].continente == LABEL_OPTION_SIN_CONTINENTE)
              return (true);
            return (false);
          });
        }
      */
    this.setState({ datos: data })
  }

  private _procesaColumnas(simpleListCols: ISimpleListCol[]): IColumn[] {
    let columns: IColumn[] = new Array<IColumn>();

    simpleListCols.forEach((unaColumna: ISimpleListCol, indice) => {

      let laColumna: IColumn = {
        key: indice.toString(),
        name: unaColumna.title,
        fieldName: unaColumna.field,
        minWidth: unaColumna.width * 1,
        maxWidth: unaColumna.width * 3,
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
      if (unaColumna.fieldUrl || unaColumna.fieldTooltip || unaColumna.isImage) {
        if (unaColumna.fieldUrl && unaColumna.fieldTooltip) {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(unaColumna.fieldTooltip) ? unaColumna.fieldTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Link hRef={item[(unaColumna.fieldUrl) ? unaColumna.fieldUrl : 0]} target='_blank'>
                  {item[unaColumna.field]}
                </Link>
              </TooltipHost>
            );
          }
        } else if (unaColumna.fieldTooltip) {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(unaColumna.fieldTooltip) ? unaColumna.fieldTooltip : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                {item[unaColumna.field]}
              </TooltipHost>
            );
          }
        } else if (unaColumna.isImage == true) {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[unaColumna.field]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Image
                  src={item[unaColumna.field]}
                  alt='sancamalancafumalicalipunxi'
                  width={unaColumna.width * 4}
                />
              </TooltipHost>
            );
          }
        } else {
          laColumna.onRender = (item) => {
            return (
              <TooltipHost
                content={item[(unaColumna.fieldUrl) ? unaColumna.fieldUrl : 0]}
                // id={this._hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <a href={item[(unaColumna.fieldUrl) ? unaColumna.fieldUrl : 0]} target='_blank'>
                  {item[unaColumna.field]}
                </a>
              </TooltipHost>
            );
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
        copyAndSortByKey(this.state.datos, false)
    });
  };

  public render(): JSX.Element {
    if (this.props.hidden) {
      return (<div></div>);
    } else {
      return (
        <div>
          <h2>{this.props.title}</h2>
          <div>
            <div className={classNames.controlWrapper}>
              {(!this.props.showToggleCompactMode) ? null :
                <Toggle
                  label="Enable compact mode"
                  checked={this.state.isCompactMode}
                  onChange={(ev, checked: boolean): void => {
                    this.setState({ isCompactMode: checked });
                  }}
                  onText="Compact"
                  offText="Normal"
                  styles={controlStyles}
                />
              }
              {(!(this.props.fieldsTextFilter && this.props.fieldsTextFilter.length > 0)) ? null :
                <SearchBox
                  placeholder="Filter by name"
                  // onSearch={(text: string): void => {
                  onChange={(text: string): void => {
                    this._filterText = text;
                    this._filter();
                  }}
                  styles={controlStyles}
                />
              }
              <Dropdown
                selectedKey={this.state.filterContinentOption}
                onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
                  this.setState({ filterContinentOption: item.key });
                }}
                placeholder="Select a Continent"
                options={this._continentOption}
                styles={controlStyles}
                style={{ width: 220 }}
              />
              <Dropdown
                selectedKey={this.state.filterRegionOption}
                onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
                  this.setState({ filterRegionOption: item.key });
                }}
                placeholder="Select a Region"
                options={this._regionOption}
                styles={controlStyles}
                style={{ width: 300 }}
              />
              <Label styles={controlStyles}>{`Se están mostrando ${this.state.datos.length} paises.`}</Label>
            </div>
            <DetailsList
              items={this.state.datos}
              compact={this.state.isCompactMode}
              columns={this.state.columns}
              // layoutMode={DetailsListLayoutMode.justified}
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
