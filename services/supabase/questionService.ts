import { supabase } from '../../lib/supabase';
import { IQuestionService, QuestionWithDetails } from '../types';

export class SupabaseQuestionService implements IQuestionService {
  async getQuestionsBySurgeryTypeId(surgeryTypeId: string): Promise<QuestionWithDetails[]> {
    const { data, error } = await supabase
      .from('surgery_questions')
      .select(`
                display_order,
                is_active,
                question:questions (
                    *,
                    options:question_options(*)
                )
            `)
      .eq('surgery_type_id', surgeryTypeId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }

    if (!data) return [];

    // Map the result to match QuestionWithDetails structure
    // We combine the link table fields (display_order) with the question fields
    const questions = data.map((item: any) => {
      const question = item.question;

      // Sort options by display_order if they exist
      if (question.options && Array.isArray(question.options)) {
        question.options.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
      }

      return {
        ...question,
        display_order: item.display_order, // Use the order from the link table
        is_active: item.is_active // Use the active status from the link table
      };
    });

    return questions as QuestionWithDetails[];
  }
}

export const questionService = new SupabaseQuestionService();
