import { supabase } from '../../lib/supabase';
import { DailyReport, IReportService, QuestionWithDetails } from '../types';

export class SupabaseReportService implements IReportService {
  async submitDailyReport(
    patientId: string,
    answers: Record<string, any>,
    questions: QuestionWithDetails[]
  ): Promise<void> {
    let criticalCount = 0;
    let nonCriticalCount = 0;
    let painLevel = 0;
    let symptoms: string[] = [];
    let alertMessages: string[] = [];

    // 1. Analyze answers against questions rules
    for (const question of questions) {
      const answerValue = answers[question.id];

      // Skip if no answer provided
      if (answerValue === undefined || answerValue === null || answerValue === '') continue;

      const isCritical = question.metadata && (question.metadata as any).category === 'critical';
      let isAbnormal = false;

      // Handle different input types
      if (question.input_type === 'scale') {
        const numericVal = parseInt(answerValue, 10);
        if (!isNaN(numericVal)) {
          if (question.text.toLowerCase().includes('dor')) {
            painLevel = numericVal;
          }
          // Check threshold from metadata (default to > 5 if not specified for pain)
          const abnormalMin = (question.metadata as any).abnormal_min;
          if (abnormalMin !== undefined && numericVal >= abnormalMin) {
            isAbnormal = true;
          } else if (question.text.toLowerCase().includes('dor') && numericVal > 5) {
            isAbnormal = true;
          }
        }
      } else if (question.input_type === 'boolean' || question.input_type === 'select') {
        // Find selected option
        const selectedOption = question.options?.find(opt => opt.value === String(answerValue));
        if (selectedOption) {
          if (selectedOption.is_abnormal) {
            isAbnormal = true;
            symptoms.push(question.text); // Add question text to symptoms list
            alertMessages.push(`${question.text}: ${selectedOption.label}`);
          }
        }
      } else if (question.input_type === 'multiselect') {
        // Handle array of values
        if (Array.isArray(answerValue)) {
          for (const val of answerValue) {
            const option = question.options?.find(opt => opt.value === String(val));
            if (option && option.is_abnormal) {
              isAbnormal = true; // Mark question as having abnormal answer
              symptoms.push(`${question.text} (${option.label})`);
              alertMessages.push(`${question.text}: ${option.label}`);
            }
          }
        }
      }

      if (isAbnormal) {
        if (isCritical) {
          criticalCount++;
        } else {
          nonCriticalCount++;
        }
      }
    }

    // 2. Determine Alert Severity
    let alertSeverity: 'critical' | 'warning' | null = null;
    let alertReason = '';

    if (criticalCount >= 3) {
      alertSeverity = 'critical';
      alertReason = '3 ou mais sinais críticos detectados.';
    } else if (nonCriticalCount >= 5) {
      alertSeverity = 'critical';
      alertReason = '5 ou mais sinais de alerta detectados.';
    } else if (nonCriticalCount >= 3) {
      alertSeverity = 'warning';
      alertReason = '3 a 4 sinais de alerta detectados.';
    }

    // 3. Insert Daily Report
    const { error: reportError } = await supabase.from('daily_reports').insert({
      patient_id: patientId,
      date: new Date().toISOString(),
      pain_level: painLevel,
      symptoms: symptoms.length > 0 ? symptoms : null, // Store list of symptoms as JSON
      answers: answers // Store raw answers
    });

    if (reportError) {
      console.error('Error creating daily report:', reportError);
      throw reportError;
    }

    // 4. Create Alert if needed
    if (alertSeverity) {
      const { error: alertError } = await supabase.from('alerts').insert({
        patient_id: patientId,
        severity: alertSeverity,
        message: `${alertReason} Detalhes: ${alertMessages.join(', ')}`,
        is_resolved: false
      });

      if (alertError) {
        console.error('Error creating alert:', alertError);
        // Don't throw here, as the report was already saved. just log it.
      }
    }
  }

  async getPatientReports(patientId: string): Promise<DailyReport[]> {
    // Fetch reports
    const { data: reports, error: reportsError } = await supabase
      .from('daily_reports')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
      throw reportsError;
    }

    // Fetch alerts to correlate
    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select('severity, message, created_at')
      .eq('patient_id', patientId);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
    }

    // Map reports and attach alerts if they match the date
    return (reports || []).map(report => {
      const reportDate = new Date(report.date).toISOString().split('T')[0];

      const matchingAlerts = alerts?.filter(alert => {
        const alertDate = new Date(alert.created_at).toISOString().split('T')[0];
        return alertDate === reportDate;
      }).map(a => ({ severity: a.severity as 'critical' | 'warning', message: a.message })) || [];

      return {
        ...report,
        alerts: matchingAlerts.length > 0 ? matchingAlerts : undefined
      } as DailyReport;
    });
  }

  async getReportById(reportId: string): Promise<DailyReport | null> {
    const { data: report, error } = await supabase
      .from('daily_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      return null;
    }

    // Fetch alerts for this report's date
    const reportDate = new Date(report.date).toISOString().split('T')[0];
    const { data: alerts } = await supabase
      .from('alerts')
      .select('severity, message, created_at')
      .eq('patient_id', report.patient_id);

    const matchingAlerts = alerts?.filter(a =>
      new Date(a.created_at).toISOString().split('T')[0] === reportDate
    ).map(a => ({ severity: a.severity as 'critical' | 'warning', message: a.message }));

    return {
      ...report,
      alerts: matchingAlerts
    } as DailyReport;
  }
}

export const reportService = new SupabaseReportService();
