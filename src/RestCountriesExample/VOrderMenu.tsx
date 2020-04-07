import * as React from "react";
import { IContextualMenuProps } from "office-ui-fabric-react/lib/ContextualMenu";
import { DefaultButton } from "office-ui-fabric-react/lib/components/Button";

export interface IVOrderMenuItem {
  key: number;
  text: string;
}
// export const ORDER_OPTION_NAMES: IVOrderMenuNames[] = [
//     { key: VOrderMenuOptions.none, name: 'Ordenar' },
//     { key: VOrderMenuOptions.newer, name: 'Ordenar por mas Recientes' },
//     { key: VOrderMenuOptions.older, name: 'Ordenar por mas Antiguos' },
//     { key: VOrderMenuOptions.popular, name: 'Ordenar por mas Consultados' },
//     { key: VOrderMenuOptions.alfaAsc, name: 'Ordenar de A a Z' },
//     { key: VOrderMenuOptions.alfaDesc, name: 'Ordenar de Z a A' },
// ];

export interface IVOrderMenuState {
  orderOption: number;
}

export interface IVOrderMenuProps {
  orderOptions: IVOrderMenuItem[];
  onOrderBy: (ordenOption: number) => void;
  orderOptionDef: number;
}

export class VOrderMenu extends React.Component<
  IVOrderMenuProps,
  IVOrderMenuState
> {
  // Data for menu
  private _menuOrdenar: IContextualMenuProps = { items: [] };

  public constructor(props: Readonly<IVOrderMenuProps>) {
    super(props);

    // Inicializar Estados
    this.state = {
      orderOption: props.orderOptionDef
    };

    // Inicializar opciones
    props.orderOptions.forEach(valor => {
      this._menuOrdenar.items.push({
        key: valor.key.toString(),
        name: valor.text,
        onClick: () => {
          if (valor.key != this.state.orderOption) {
            this.props.onOrderBy(valor.key);
            this.setState({ orderOption: valor.key });
          }
        }
      });
    });

    // Binds
    // this._onChangeComboStock = this._onChangeComboStock.bind(this);
  }
  public render(): React.ReactElement<{}> {
    return (
      <div>
        <DefaultButton
          text={this.props.orderOptions[this.state.orderOption].text}
          menuProps={this._menuOrdenar}
          iconProps={{ iconName: "SortLines" }}
        />
      </div>
    );
  }
}
