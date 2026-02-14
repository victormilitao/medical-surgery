import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { patientService } from '../services';
import { PatientWithProfile } from '../services/types';

export const usePatientsByDoctor = (
    doctorId: string | undefined,
    options?: Omit<UseQueryOptions<PatientWithProfile[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<PatientWithProfile[], Error>({
        queryKey: ['patients', 'doctor', doctorId],
        queryFn: () => {
            if (!doctorId) throw new Error('Doctor ID is required');
            return patientService.getPatientsByDoctorId(doctorId);
        },
        enabled: !!doctorId,
        ...options
    });
};

export const usePatient = (
    patientId: string | undefined,
    options?: Omit<UseQueryOptions<PatientWithProfile | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<PatientWithProfile | null, Error>({
        queryKey: ['patient', patientId],
        queryFn: () => {
            if (!patientId) throw new Error('Patient ID is required');
            return patientService.getPatientById(patientId);
        },
        enabled: !!patientId,
        ...options
    });
};
