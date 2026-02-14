import { Database } from '../types/supabase';

type Patient = Database['public']['Tables']['patients']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface PatientWithProfile extends Patient {
    profile: Pick<Profile, 'full_name' | 'email'>;
}

export interface PatientListItem {
    id: string;
    name: string;
    surgeryDate: string;
    day: number;
    status: 'critical' | 'warning' | 'stable' | 'finished';
    lastUpdate: string;
    alerts?: string[];
}

export interface IPatientService {
    getPatientsByDoctorId(doctorId: string): Promise<PatientWithProfile[]>;
    getPatientById(patientId: string): Promise<PatientWithProfile | null>;
}
