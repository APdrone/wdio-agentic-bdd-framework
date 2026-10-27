export interface VitalSigns {
  systolic: number;
  diastolic: number;
  heartRate: number;
  spo2: number;
  temp?: number;
}

export type TriageScore = 'CRITICAL' | 'URGENT' | 'ROUTINE';

export interface PatientRecord {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  vitals: VitalSigns;
  triageScore: TriageScore;
  bed: string;
  allergies: string[];
  medications: string[];
}
