export type PaymentProps = {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  method: string;
  installments: number;
  transactionId?: string | null;
  createdAt: Date;
};

export class Payment {
  private props: PaymentProps;
  constructor(props: PaymentProps) {
    this.props = props;
  }
  get id() {
    return this.props.id;
  }
  get orderId() {
    return this.props.orderId;
  }
  get amount() {
    return this.props.amount;
  }
  get status() {
    return this.props.status;
  }
  get method() {
    return this.props.method;
  }
  get installments() {
    return this.props.installments;
  }
  get transactionId() {
    return this.props.transactionId ?? null;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
