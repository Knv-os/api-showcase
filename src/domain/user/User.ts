export type UserProps = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get name() {
    return this.props.name;
  }
  get password_hash() {
    return this.props.password_hash;
  }
  get role() {
    return this.props.role;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
