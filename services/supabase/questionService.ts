import { supabase } from '../../lib/supabase';
import { IQuestionService, QuestionWithDetails } from '../types';

export class SupabaseQuestionService implements IQuestionService {
  async getQuestionsBySurgeryTypeId(surgeryTypeId: string): Promise<QuestionWithDetails[]> {
    const { data, error } = await supabase
      .from('questions')
      .select(`
                *,
                options:question_options(*)
            `)
      .eq('surgery_type_id', surgeryTypeId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }

    if (data) {
      // Sort options by display_order
      data.forEach((q: any) => {
        if (q.options && Array.isArray(q.options)) {
          q.options.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
        }
      });
    }

    return (data || []) as QuestionWithDetails[];
  }
}

export const questionService = new SupabaseQuestionService();
