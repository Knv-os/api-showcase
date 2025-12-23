export type MeasurementProps = {
  id: string;
  clientId: string;
  neck?: number | null;
  chest?: number | null;
  waist?: number | null;
  sleeve?: number | null;
  length?: number | null;
  observations?: string | null;
  createdAt: Date;
};

export class Measurement {
  private props: MeasurementProps;
  constructor(props: MeasurementProps) {
    this.props = props;
  }
  get id() {
    return this.props.id;
  }
  get clientId() {
    return this.props.clientId;
  }
  get neck() {
    return this.props.neck ?? null;
  }
  get chest() {
    return this.props.chest ?? null;
  }
  get waist() {
    return this.props.waist ?? null;
  }
  get sleeve() {
    return this.props.sleeve ?? null;
  }
  get length() {
    return this.props.length ?? null;
  }
  get observations() {
    return this.props.observations ?? null;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
