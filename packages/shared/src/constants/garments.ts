import { GarmentCategory } from '../types';

export interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
  unit: string;
}

export const GARMENT_FIELDS: Record<GarmentCategory, FieldConfig[]> = {
  BLOUSE: [
    { key: 'chest', label: 'Chest Around', placeholder: 'e.g. 34', unit: 'in' },
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 28', unit: 'in' },
    { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g. 14', unit: 'in' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g. 6.5', unit: 'in' },
    { key: 'sleeveAround', label: 'Sleeve Round', placeholder: 'e.g. 12', unit: 'in' },
    { key: 'frontNeckDepth', label: 'Front Neck Depth', placeholder: 'e.g. 6', unit: 'in' },
    { key: 'backNeckDepth', label: 'Back Neck Depth', placeholder: 'e.g. 8', unit: 'in' },
    { key: 'totalLength', label: 'Blouse Length', placeholder: 'e.g. 13.5', unit: 'in' }
  ],
  CHUDI: [
    { key: 'chest', label: 'Chest Around', placeholder: 'e.g. 36', unit: 'in' },
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 30', unit: 'in' },
    { key: 'hip', label: 'Hip Around', placeholder: 'e.g. 38', unit: 'in' },
    { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g. 14.5', unit: 'in' },
    { key: 'topLength', label: 'Top / Kameez Length', placeholder: 'e.g. 40', unit: 'in' },
    { key: 'bottomLength', label: 'Bottom / Salwar Length', placeholder: 'e.g. 38', unit: 'in' },
    { key: 'bottomWaist', label: 'Bottom Waist', placeholder: 'e.g. 32', unit: 'in' },
    { key: 'thigh', label: 'Thigh Round', placeholder: 'e.g. 22', unit: 'in' },
    { key: 'knee', label: 'Knee Round', placeholder: 'e.g. 16', unit: 'in' }
  ]
};
