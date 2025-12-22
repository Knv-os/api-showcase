export type ClientProps = {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  document?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Client {
  private props: ClientProps;

  constructor(props: ClientProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email ?? null;
  }
  get phone() {
    return this.props.phone;
  }
  get document() {
    return this.props.document ?? null;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
