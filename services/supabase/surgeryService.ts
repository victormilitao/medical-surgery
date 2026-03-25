import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import { ISurgeryService, SurgeryWithDetails } from '../types';

type Surgery = Database['public']['Tables']['surgeries']['Row'];

export class SupabaseSurgeryService implements ISurgeryService {
  async getSurgeriesByDoctorId(doctorId: string): Promise<SurgeryWithDetails[]> {
    const { data, error } = await supabase
      .from('surgeries')
      .select(`
                *,
                patient:profiles!surgeries_patient_id_fkey(full_name, email, phone, sex),
                doctor:profiles!surgeries_doctor_id_fkey(full_name),
                surgery_type:surgery_types(name, description, expected_recovery_days),
                daily_reports(date)
            `)
      .eq('doctor_id', doctorId)
      .order('surgery_date', { ascending: false });

    if (error) {
      console.error('Error fetching surgeries:', error);
      throw error;
    }

    return (data || []).map(s => {
      // Find the latest report date from the daily_reports join
      const reports = (s as any).daily_reports as { date: string }[] | undefined;
      let lastResponseDate: string | null = null;
      if (reports && reports.length > 0) {
        const sorted = [...reports].sort((a, b) => b.date.localeCompare(a.date));
        lastResponseDate = sorted[0].date;
      }

      return {
        ...s,
        patient: s.patient as any,
        doctor: s.doctor as any,
        lastResponseDate,
      };
    });
  }

  async getSurgeryById(surgeryId: string): Promise<SurgeryWithDetails | null> {
    const { data, error } = await supabase
      .from('surgeries')
      .select(`
                *,
                patient:profiles!surgeries_patient_id_fkey(full_name, email, phone, sex),
                doctor:profiles!surgeries_doctor_id_fkey(full_name),
                surgery_type:surgery_types(name, description, expected_recovery_days)
            `)
      .eq('id', surgeryId)
      .single();

    if (error) {
      console.error('Error fetching surgery:', error);
      return null;
    }

    return data ? {
      ...data,
      patient: data.patient as any,
      doctor: data.doctor as any
    } : null;
  }

  async createSurgery(data: {
    doctorId: string;
    patientId: string;
    surgeryTypeId: string;
    surgeryDate: string;
    notes?: string;
    followUpDays?: number;
  }): Promise<Surgery> {
    const { data: surgery, error } = await supabase
      .from('surgeries')
      .insert({
        doctor_id: data.doctorId,
        patient_id: data.patientId,
        surgery_type_id: data.surgeryTypeId,
        surgery_date: data.surgeryDate,
        notes: data.notes,
        status: 'active',
        medical_status: 'stable' as const,
        follow_up_days: data.followUpDays ?? null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating surgery:', error);
      throw error;
    }

    // Link patient to this surgery
    await supabase
      .from('patients')
      .update({ surgery_id: surgery.id })
      .eq('id', data.patientId);

    return surgery;
  }

  async finalizeSurgeriesPastRecovery(doctorId: string): Promise<number> {
    // Fetch active surgeries with their follow_up_days and surgery type's expected_recovery_days
    const { data: activeSurgeries, error: fetchError } = await supabase
      .from('surgeries')
      .select(`
        id,
        surgery_date,
        follow_up_days,
        surgery_type:surgery_types(expected_recovery_days)
      `)
      .eq('doctor_id', doctorId)
      .eq('status', 'active');

    if (fetchError) {
      console.error('Error fetching active surgeries:', fetchError);
      throw fetchError;
    }

    if (!activeSurgeries || activeSurgeries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter surgeries that have passed their follow-up period
    const surgeriesToFinalize = activeSurgeries.filter(s => {
      const recoveryDays = s.follow_up_days ?? (s.surgery_type as any)?.expected_recovery_days ?? 14;
      const dateParts = s.surgery_date.split('T')[0].split('-');
      const surgeryDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
      surgeryDate.setDate(surgeryDate.getDate() + recoveryDays + 1); // +1 because day after last recovery day
      return surgeryDate.getTime() <= today.getTime();
    });

    if (surgeriesToFinalize.length === 0) return 0;

    const idsToFinalize = surgeriesToFinalize.map(s => s.id);

    const { data, error } = await supabase
      .from('surgeries')
      .update({ status: 'completed' })
      .in('id', idsToFinalize)
      .select('id');

    if (error) {
      console.error('Error finalizing surgeries:', error);
      throw error;
    }

    return data?.length || 0;
  }
}

export const surgeryService = new SupabaseSurgeryService();
