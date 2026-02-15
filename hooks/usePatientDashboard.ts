import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { patientService } from '../services';
import { PatientDashboardData } from '../services/types';

export const usePatientDashboard = (
  patientId: string | undefined,
  options?: Omit<UseQueryOptions<PatientDashboardData | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PatientDashboardData | null, Error>({
    queryKey: ['patient-dashboard', patientId],
    queryFn: () => {
      if (!patientId) throw new Error('Patient ID is required');
      return patientService.getPatientDashboardData(patientId);
    },
    enabled: !!patientId,
    ...options
  });
};
