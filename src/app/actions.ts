'use server';

import { generatePreliminaryDiagnosis, type GeneratePreliminaryDiagnosisOutput } from '@/ai/flows/generate-preliminary-diagnosis';
import { generateHealthReport, type GenerateHealthReportInput } from '@/ai/flows/generate-health-report';
import { z } from 'zod';

const symptomSchema = z.string().min(10, "Please describe your symptoms in more detail.");

export async function handleSymptomSubmission(symptoms: string): Promise<GeneratePreliminaryDiagnosisOutput | { error: string }> {
  const validation = symptomSchema.safeParse(symptoms);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const diagnosis = await generatePreliminaryDiagnosis({
      symptoms: validation.data,
      language: 'english', 
    });
    return diagnosis;
  } catch (e) {
    console.error(e);
    return { error: 'There was an error processing your request. Please try again.' };
  }
}

export async function handleReportGeneration(context: GenerateHealthReportInput): Promise<{ report: string } | { error: string }> {
  try {
    const result = await generateHealthReport(context);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'There was an error generating the report. Please try again.' };
  }
}
