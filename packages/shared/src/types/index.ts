export type UserRole = 'ADMIN' | 'EMPLOYEE';

export type GarmentCategory = 'BLOUSE' | 'CHUDI';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface Customer {
  id: string;
  customerCode: string;
  fullName: string;
  phoneNumber: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  measurements?: Measurement[];
}

export interface BlouseMeasurementData {
  chest: string;
  waist: string;
  shoulder: string;
  sleeveLength: string;
  sleeveAround: string;
  frontNeckDepth: string;
  backNeckDepth: string;
  totalLength: string;
  [key: string]: string;
}

export interface ChudiMeasurementData {
  chest: string;
  waist: string;
  hip: string;
  shoulder: string;
  topLength: string;
  bottomLength: string;
  bottomWaist: string;
  thigh: string;
  knee: string;
  [key: string]: string;
}

export type MeasurementData = BlouseMeasurementData | ChudiMeasurementData;

export interface Measurement {
  id: string;
  customerId: string;
  garmentType: GarmentCategory;
  version: number;
  isLatest: boolean;
  data: MeasurementData;
  notes?: string;
  createdAt: string;
}

export interface CustomerListResponse {
  total: number;
  customers: Customer[];
}
