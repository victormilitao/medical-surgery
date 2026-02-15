import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import { IPatientService, PatientDashboardData, PatientWithProfile } from '../types';

type Surgery = Database['public']['Tables']['surgeries']['Row'];
type SurgeryType = Database['public']['Tables']['surgery_types']['Row'];

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

    async getPatientDashboardData(patientId: string): Promise<PatientDashboardData | null> {
        // Get patient profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', patientId)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile:', profileError);
            return null;
        }

        // Get patient's current surgery
        const { data: patient } = await supabase
            .from('patients')
            .select('surgery_id')
            .eq('id', patientId)
            .single();

        let currentSurgery: (Surgery & { surgery_type: Pick<SurgeryType, 'name' | 'description' | 'expected_recovery_days'> }) | null = null;
        let daysSinceSurgery = 0;
        const totalRecoveryDays = 14;

        if (patient?.surgery_id) {
            const { data: surgery } = await supabase
                .from('surgeries')
                .select(`
                    *,
                    surgery_type:surgery_types(name, description, expected_recovery_days)
                `)
                .eq('id', patient.surgery_id)
                .single();

            if (surgery) {
                currentSurgery = surgery as any;
                const surgeryDate = new Date(surgery.surgery_date);
                const today = new Date();
                daysSinceSurgery = Math.floor((today.getTime() - surgeryDate.getTime()) / (1000 * 60 * 60 * 24));
            }
        }

        return {
            profile,
            currentSurgery,
            daysSinceSurgery,
            totalRecoveryDays
        };
    }
}

// Singleton instance
export const patientService = new SupabasePatientService();
