import { supabase } from '../../lib/supabase';
import { IGuidanceService, SurgeryTypePhaseGuideline, SurgeryTypeSign } from '../types';

export class SupabaseGuidanceService implements IGuidanceService {
  async getSignsBySurgeryTypeId(surgeryTypeId: string): Promise<SurgeryTypeSign[]> {
    const { data, error } = await supabase
      .from('surgery_type_signs')
      .select('id, surgery_type_id, category, description, display_order')
      .eq('surgery_type_id', surgeryTypeId)
      .order('category')
      .order('display_order');

    if (error) {
      console.error('Error fetching surgery type signs:', error);
      throw error;
    }

    return (data || []).map(row => ({
      ...row,
      category: row.category as SurgeryTypeSign['category'],
    }));
  }

  async getPhaseGuidelinesBySurgeryTypeId(surgeryTypeId: string): Promise<SurgeryTypePhaseGuideline[]> {
    const { data, error } = await supabase
      .from('surgery_type_phase_guidelines')
      .select('id, surgery_type_id, phase_start_day, phase_end_day, phase_title, phase_subtitle, items, highlight_text, display_order')
      .eq('surgery_type_id', surgeryTypeId)
      .order('display_order');

    if (error) {
      console.error('Error fetching phase guidelines:', error);
      throw error;
    }

    return (data || []).map(row => ({
      ...row,
      items: Array.isArray(row.items) ? (row.items as string[]) : [],
    }));
  }
}

export const guidanceService = new SupabaseGuidanceService();
