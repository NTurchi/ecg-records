export interface Ecg {
  id: string;
  patientFullName: string;
  recordTime: Date;
  labelId: string;
}

export interface EcgSearchFilters {
  labelIds?: string[];
  patientFullName?: string;
}
