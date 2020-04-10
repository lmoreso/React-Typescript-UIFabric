import * as React from "react";
import { mergeStyleSets, getTheme } from '@uifabric/styling';

export interface IDebugListConfig {
  key: string;
  tituloColumna: string;
  anchoColumna: number;
  nombreColumna: string;
  linkColumna?: string;
  tooltipColumna?: string;
}

export interface IDebugListRenderProps {
  list: DebugList;
  datos: any[];
  onOrderBy?: (orden: number) => void;
  hidden?: boolean;
}

export function DebugListRenderTable(props: IDebugListRenderProps): React.ReactElement<{}> {
  if (props.hidden)
    return <div />
  else
    return props.list.renderTable(props.datos, props.onOrderBy);
}

export function DebugListRenderTxt(props: IDebugListRenderProps): React.ReactElement<{}> {
  if (props.hidden)
    return <div />
  else
    return props.list.renderTxt(props.datos, props.onOrderBy);
}

export class DebugList {
  public config: IDebugListConfig[];
  public descripcion: string;
  private _colsNames: string;
  private _colsSubs: string;
  private static _subChar: string =
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
  private static _subSpace: string =
    "················································································································";
  private static _espacio: string = '·';

  public constructor(descripcion: string, listItems: IDebugListConfig[]) {
    this.config = listItems;
    this.descripcion = descripcion;
    // Construcción de las dos líneas de título:
    this._colsNames = "";
    this._colsSubs = "";
    this.config.forEach((item: IDebugListConfig) => {
      var aux: string = item.tituloColumna + DebugList._subSpace;
      this._colsNames =
        this._colsNames + aux.substr(0, item.anchoColumna) + DebugList._espacio;
      this._colsSubs =
        this._colsSubs + DebugList._subChar.substr(0, item.anchoColumna) + DebugList._espacio;
    });
  }

  public length(): number {
    return this.config.length;
  }

  public getTitle(numRegs?: number): string {
    if (numRegs !== undefined)
      return `${this.descripcion.replace("%n", numRegs.toString())}`;
    else return `No se ha encontrado ningún Registro:`;
  }

  public getColsNames(): string {
    return this._colsNames;
  }

  public getColsSubs(): string {
    return this._colsSubs;
  }

  public getLine(dato: Object): string {
    let sAux: string = "";
    let sAux2: string;

    this.config.forEach((item: IDebugListConfig) => {
      sAux2 = dato[item.nombreColumna];
      if (sAux2) {
        sAux2 = sAux2 + DebugList._subSpace;
      } else {
        sAux2 = DebugList._subSpace;
      }
      sAux = sAux + sAux2.substr(0, item.anchoColumna) + DebugList._espacio;
    });

    return sAux;
  }

  /**
   * console: Escribe la lista de datos en la consola
   */
  public console(listDatos: any[]) {
    if (this.length() === 0) {
      console.log("DebugList-No hay Configuración que pintar");
      return;
    }
    // Título
    console.log(this.getTitle(listDatos.length));
    // Pintar los títulos de las Columnas
    console.log(this.getColsNames());
    console.log(this.getColsSubs());
    // Pintar los Datos
    listDatos.forEach((dato: any) => {
      console.log(this.getLine(dato));
    });
  }
  /**
   * console: Escribe la lista de datos en la consola
   */

  public renderTxt(listDatos: any[], onOrderBy?: (orden: number) => void): React.ReactElement<{}> {
    return (
      <div style={{ font: 'small monospace' }}>
        <p style={{ font: 'bold small monospace' }}>{this.getTitle(listDatos.length)}</p>
        <p style={{ font: 'bold small monospace' }}>{this.getColsNames()}</p>
        <p style={{ font: 'bold small monospace' }}>{this.getColsSubs()}</p>
        {listDatos.map((dato: any, index) => <span key={index.toString()} style={{ font: 'bold small monospace' }}><br />{this.getLine(dato)}</span>)}
      </div>
    );
  }

  public renderTable(listDatos: any[], onOrderBy?: (orden: number) => void): React.ReactElement<{}> {
    const color = getTheme().palette.neutralPrimary;
    const estilos = mergeStyleSets({
      title: {
        fontSize: "medium",
        margin: "4px",
        alignSelf: 'center',
        fontWeight: 'bold'

      },
      tabla: {
        fontSize: "small",
        borderWidth: "1px",
        borderColor: color,
        borderStyle: "solid"
      },
      cellsTit: {
        fontSize: "small",
        borderWidth: "1px",
        borderColor: color,
        borderStyle: "solid",
        backgroundColor: color,
        color: "white"
      },
      cells: {
        fontSize: "small",
        borderWidth: "1px",
        borderColor: color,
        borderStyle: "solid"
      }
    });

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: 'column',
            alignItems: "center",
          }}
        >
          <label className={estilos.title}>
            {this.getTitle(listDatos.length)}
          </label>
          {/* <span className={estilos.title}>
                        <VOrderMenu
                            onOrderBy={onOrderBy}
                            orderOptionDef={0}
                            orderOptions={}
                        />
                    </span> */}
        </div>
        <table className={estilos.tabla}>
          <thead>
            <tr key={'-1'}>
              {this.config.map((item: IDebugListConfig, indice: number) => {
                return (
                  <th key={`-1_${indice.toString()}`} className={estilos.cellsTit}>{item.tituloColumna}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {listDatos.map((dato: any) => {
              return (
                <tr key={dato.key}>
                  {this.config.map((item: IDebugListConfig, indice: number) => {
                    if (item.linkColumna) {
                      return (
                        <td key={`${dato.key}_${indice.toString()}`} className={estilos.cells}>
                          <a href={dato[item.linkColumna]} target="_blank">
                            <span title={(item.tooltipColumna) ? dato[item.tooltipColumna] : ''}>{Array.isArray(dato[item.nombreColumna]) ? dato[item.nombreColumna].join(', ') : dato[item.nombreColumna]}</span>
                          </a>
                        </td>
                      );
                    } else {
                      return (
                        <td key={`${dato.key}_${indice.toString()}`} className={estilos.cells}>
                          <span title={(item.tooltipColumna)? dato[item.tooltipColumna] : ''}>{Array.isArray(dato[item.nombreColumna]) ? dato[item.nombreColumna].join(', ') : dato[item.nombreColumna]}</span>
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
