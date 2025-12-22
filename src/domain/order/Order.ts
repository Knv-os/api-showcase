export type OrderProps = {
  id: string;
  status: string;
  totalValue: number;
  trialDate?: Date | null;
  deliveryDate?: Date | null;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Order {
  private props: OrderProps;

  constructor(props: OrderProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }
  get status() {
    return this.props.status;
  }
  get totalValue() {
    return this.props.totalValue;
  }
  get trialDate() {
    return this.props.trialDate ?? null;
  }
  get deliveryDate() {
    return this.props.deliveryDate ?? null;
  }
  get clientId() {
    return this.props.clientId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
