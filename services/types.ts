import { Database } from '../types/supabase';

type Patient = Database['public']['Tables']['patients']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Surgery = Database['public']['Tables']['surgeries']['Row'];

export interface PatientWithProfile extends Patient {
    profile: Pick<Profile, 'full_name' | 'email'>;
}

export interface SurgeryWithDetails extends Surgery {
    patient: Pick<Profile, 'full_name' | 'email' | 'phone'>;
    doctor: Pick<Profile, 'full_name'>;
}

export interface PatientListItem {
    id: string;
    name: string;
    surgeryDate: string;
    surgeryType: string;
    day: number;
    status: 'active' | 'completed' | 'cancelled';
    lastUpdate: string;
    alerts?: string[];
}

export interface IPatientService {
    getPatientsByDoctorId(doctorId: string): Promise<PatientWithProfile[]>;
    getPatientById(patientId: string): Promise<PatientWithProfile | null>;
}

export interface ISurgeryService {
    getSurgeriesByDoctorId(doctorId: string): Promise<SurgeryWithDetails[]>;
    getSurgeryById(surgeryId: string): Promise<SurgeryWithDetails | null>;
    createSurgery(data: {
        doctorId: string;
        patientId: string;
        surgeryType: string;
        surgeryDate: string;
        notes?: string;
    }): Promise<Surgery>;
}
