import { supabase } from '../../lib/supabase';
import { IPatientService, PatientWithProfile } from '../types';

export class SupabasePatientService implements IPatientService {
    async getPatientsByDoctorId(doctorId: string): Promise<PatientWithProfile[]> {
        const { data, error } = await supabase
            .from('patients')
            .select(`
                *,
                profile:profiles!patients_id_fkey(full_name, email)
            `)
            .eq('doctor_id', doctorId);

        if (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }

        return (data || []).map(p => ({
            ...p,
            profile: p.profile as any
        }));
    }

    async getPatientById(patientId: string): Promise<PatientWithProfile | null> {
        const { data, error } = await supabase
            .from('patients')
            .select(`
                *,
                profile:profiles!patients_id_fkey(full_name, email)
            `)
            .eq('id', patientId)
            .single();

        if (error) {
            console.error('Error fetching patient:', error);
            return null;
        }

        return data ? {
            ...data,
            profile: data.profile as any
        } : null;
    }
}

// Singleton instance
export const patientService = new SupabasePatientService();
