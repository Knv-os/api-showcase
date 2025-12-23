import { Measurement } from "./Measurement";

export interface CreateMeasurementData {
  clientId: string;
  neck?: number | null;
  chest?: number | null;
  waist?: number | null;
  sleeve?: number | null;
  length?: number | null;
  observations?: string | null;
}

export interface UpdateMeasurementData {
  neck?: number | null;
  chest?: number | null;
  waist?: number | null;
  sleeve?: number | null;
  length?: number | null;
  observations?: string | null;
}

export interface MeasurementRepository {
  create(data: CreateMeasurementData): Promise<Measurement>;
  findById(id: string): Promise<Measurement | null>;
  list(): Promise<Measurement[]>;
  update(id: string, data: UpdateMeasurementData): Promise<Measurement>;
  delete(id: string): Promise<void>;
}
