'use server';

import { generatePreliminaryDiagnosis, type GeneratePreliminaryDiagnosisOutput, type GeneratePreliminaryDiagnosisInput } from '@/ai/flows/generate-preliminary-diagnosis';
import { generateHealthReport, type GenerateHealthReportInput } from '@/ai/flows/generate-health-report';
import { analyzeMedicalImage, type AnalyzeMedicalImageInput, type AnalyzeMedicalImageOutput } from '@/ai/flows/analyze-medical-image';
import { z } from 'zod';

const symptomSchema = z.string().min(10, "Please describe your symptoms in more detail.");

export async function handleSymptomSubmission(symptoms: string, language: string, location?: string | null): Promise<GeneratePreliminaryDiagnosisOutput | { error: string }> {
  const validation = symptomSchema.safeParse(symptoms);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const input: GeneratePreliminaryDiagnosisInput = {
      symptoms: validation.data,
      language: language,
    };
    if (location) {
      input.location = location;
    }
    const diagnosis = await generatePreliminaryDiagnosis(input);
    return diagnosis;
  } catch (e) {
    console.error(e);
    return { error: 'There was an error processing your request. Please try again.' };
  }
}

export async function handleReportGeneration(context: GenerateHealthReportInput & { language: string }): Promise<{ report: string } | { error: string }> {
  try {
    const result = await generateHealthReport(context);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'There was an error generating the report. Please try again.' };
  }
}

export async function handleImageAnalysis(photoDataUri: string, language: string): Promise<AnalyzeMedicalImageOutput | { error: string }> {
  try {
    const result = await analyzeMedicalImage({ photoDataUri, language });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'There was an error analyzing the image. Please try again.' };
  }
}
