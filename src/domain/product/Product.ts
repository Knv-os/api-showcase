export type ProductProps = {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number;
  supplierId?: string | null;
};

export class Product {
  private props: ProductProps;
  constructor(props: ProductProps) {
    this.props = props;
  }
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description ?? null;
  }
  get basePrice() {
    return this.props.basePrice;
  }
  get supplierId() {
    return this.props.supplierId ?? null;
  }
}
