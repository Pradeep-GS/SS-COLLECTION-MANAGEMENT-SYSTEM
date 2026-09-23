export const GARMENT_CATEGORIES = [
  'BLOUSE',
  'CHUDI',
  'SAREE',
  'KURTI',
  'LEHENGA',
  'SALWAR',
  'SHIRT',
  'PANT',
  'SUIT',
  'CUSTOM'
];

export const GARMENT_FIELDS = {
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
  ],
  SAREE: [
    { key: 'sareeLength', label: 'Saree Total Length', placeholder: 'e.g. 5.5m / 6.25m', unit: 'm' },
    { key: 'blouseChest', label: 'Blouse Chest', placeholder: 'e.g. 34', unit: 'in' },
    { key: 'blouseLength', label: 'Blouse Length', placeholder: 'e.g. 14', unit: 'in' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g. 8', unit: 'in' },
    { key: 'fallPicot', label: 'Fall & Picot Required', placeholder: 'e.g. Yes / No', unit: '' },
    { key: 'pleatsCount', label: 'Ready Pleats Count', placeholder: 'e.g. 6 Pleats', unit: '' },
    { key: 'drapingHeight', label: 'Waist to Floor Height', placeholder: 'e.g. 40', unit: 'in' }
  ],
  KURTI: [
    { key: 'chest', label: 'Bust / Chest Around', placeholder: 'e.g. 36', unit: 'in' },
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 32', unit: 'in' },
    { key: 'hip', label: 'Hip Around', placeholder: 'e.g. 40', unit: 'in' },
    { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g. 14', unit: 'in' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g. 16', unit: 'in' },
    { key: 'sleeveAround', label: 'Sleeve Round / Arm', placeholder: 'e.g. 11', unit: 'in' },
    { key: 'frontNeckDepth', label: 'Front Neck Depth', placeholder: 'e.g. 6.5', unit: 'in' },
    { key: 'backNeckDepth', label: 'Back Neck Depth', placeholder: 'e.g. 5', unit: 'in' },
    { key: 'kurtiLength', label: 'Total Kurti Length', placeholder: 'e.g. 42', unit: 'in' },
    { key: 'slitHeight', label: 'Side Slit Height', placeholder: 'e.g. 20', unit: 'in' }
  ],
  LEHENGA: [
    { key: 'choliBust', label: 'Choli / Top Bust', placeholder: 'e.g. 34', unit: 'in' },
    { key: 'choliWaist', label: 'Choli / Top Waist', placeholder: 'e.g. 28', unit: 'in' },
    { key: 'choliLength', label: 'Choli Length', placeholder: 'e.g. 14.5', unit: 'in' },
    { key: 'lehengaWaist', label: 'Lehenga Waist', placeholder: 'e.g. 30', unit: 'in' },
    { key: 'lehengaHip', label: 'Lehenga Hip', placeholder: 'e.g. 38', unit: 'in' },
    { key: 'lehengaLength', label: 'Lehenga Height / Length', placeholder: 'e.g. 42', unit: 'in' },
    { key: 'flareGhera', label: 'Ghera / Flare Diameter', placeholder: 'e.g. 3.5m', unit: 'm' },
    { key: 'dupattaLength', label: 'Dupatta Border Length', placeholder: 'e.g. 2.5m', unit: 'm' }
  ],
  SALWAR: [
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 32', unit: 'in' },
    { key: 'hip', label: 'Hip Around', placeholder: 'e.g. 40', unit: 'in' },
    { key: 'length', label: 'Salwar Total Length', placeholder: 'e.g. 39', unit: 'in' },
    { key: 'thigh', label: 'Thigh Round', placeholder: 'e.g. 24', unit: 'in' },
    { key: 'knee', label: 'Knee Round', placeholder: 'e.g. 18', unit: 'in' },
    { key: 'ankle', label: 'Ankle / Bottom Opening', placeholder: 'e.g. 14', unit: 'in' }
  ],
  SHIRT: [
    { key: 'chest', label: 'Chest Around', placeholder: 'e.g. 38', unit: 'in' },
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 34', unit: 'in' },
    { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g. 17', unit: 'in' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g. 24', unit: 'in' },
    { key: 'collar', label: 'Collar / Neck Size', placeholder: 'e.g. 15.5', unit: 'in' },
    { key: 'shirtLength', label: 'Shirt Total Length', placeholder: 'e.g. 29', unit: 'in' }
  ],
  PANT: [
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 32', unit: 'in' },
    { key: 'hip', label: 'Hip Around', placeholder: 'e.g. 38', unit: 'in' },
    { key: 'outseam', label: 'Pant Length (Outseam)', placeholder: 'e.g. 40', unit: 'in' },
    { key: 'inseam', label: 'Inseam Length', placeholder: 'e.g. 30', unit: 'in' },
    { key: 'thigh', label: 'Thigh Round', placeholder: 'e.g. 22', unit: 'in' },
    { key: 'ankle', label: 'Bottom / Ankle Opening', placeholder: 'e.g. 15', unit: 'in' }
  ],
  SUIT: [
    { key: 'chest', label: 'Jacket Chest Around', placeholder: 'e.g. 40', unit: 'in' },
    { key: 'waist', label: 'Jacket Waist', placeholder: 'e.g. 34', unit: 'in' },
    { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g. 18', unit: 'in' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g. 25', unit: 'in' },
    { key: 'jacketLength', label: 'Jacket Length', placeholder: 'e.g. 30', unit: 'in' },
    { key: 'pantWaist', label: 'Trouser Waist', placeholder: 'e.g. 34', unit: 'in' },
    { key: 'pantLength', label: 'Trouser Length', placeholder: 'e.g. 41', unit: 'in' }
  ],
  CUSTOM: [
    { key: 'itemName', label: 'Custom Item Name', placeholder: 'e.g. Anarkali, Jacket, Gown...', unit: '' },
    { key: 'chest', label: 'Chest / Bust Around', placeholder: 'e.g. 36', unit: 'in' },
    { key: 'waist', label: 'Waist Around', placeholder: 'e.g. 30', unit: 'in' },
    { key: 'length', label: 'Total Length', placeholder: 'e.g. 45', unit: 'in' },
    { key: 'customNotes', label: 'Custom Measurement Specification', placeholder: 'Detail all custom measurements...', unit: '' }
  ]
};
