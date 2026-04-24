import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { guidanceService } from '../services';
import { SurgeryTypePhaseGuideline, SurgeryTypeSign } from '../services/types';

export const useSignsBySurgeryType = (
  surgeryTypeId: string | undefined | null,
  options?: Omit<UseQueryOptions<SurgeryTypeSign[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SurgeryTypeSign[], Error>({
    queryKey: ['surgery-type-signs', surgeryTypeId],
    queryFn: () => {
      if (!surgeryTypeId) throw new Error('Surgery type ID is required');
      return guidanceService.getSignsBySurgeryTypeId(surgeryTypeId);
    },
    enabled: !!surgeryTypeId,
    ...options,
  });
};

export const usePhaseGuidelines = (
  surgeryTypeId: string | undefined | null,
  options?: Omit<UseQueryOptions<SurgeryTypePhaseGuideline[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SurgeryTypePhaseGuideline[], Error>({
    queryKey: ['surgery-type-phase-guidelines', surgeryTypeId],
    queryFn: () => {
      if (!surgeryTypeId) throw new Error('Surgery type ID is required');
      return guidanceService.getPhaseGuidelinesBySurgeryTypeId(surgeryTypeId);
    },
    enabled: !!surgeryTypeId,
    ...options,
  });
};
