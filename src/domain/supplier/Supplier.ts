export type SupplierProps = {
  id: string;
  name: string;
  contact?: string | null;
  category?: string | null;
};

export class Supplier {
  private props: SupplierProps;
  constructor(props: SupplierProps) {
    this.props = props;
  }
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get contact() {
    return this.props.contact ?? null;
  }
  get category() {
    return this.props.category ?? null;
  }
}
