import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Surgery = Database['public']['Tables']['surgeries']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface PatientDashboardData {
  profile: Profile;
  currentSurgery: Surgery | null;
  daysSinceSurgery: number;
  totalRecoveryDays: number;
}

async function getPatientDashboardData(patientId: string): Promise<PatientDashboardData | null> {
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

  let currentSurgery: Surgery | null = null;
  let daysSinceSurgery = 0;
  const totalRecoveryDays = 14; // Default recovery period

  if (patient?.surgery_id) {
    const { data: surgery } = await supabase
      .from('surgeries')
      .select('*')
      .eq('id', patient.surgery_id)
      .single();

    if (surgery) {
      currentSurgery = surgery;
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

export const usePatientDashboard = (
  patientId: string | undefined,
  options?: Omit<UseQueryOptions<PatientDashboardData | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PatientDashboardData | null, Error>({
    queryKey: ['patient-dashboard', patientId],
    queryFn: () => {
      if (!patientId) throw new Error('Patient ID is required');
      return getPatientDashboardData(patientId);
    },
    enabled: !!patientId,
    ...options
  });
};
