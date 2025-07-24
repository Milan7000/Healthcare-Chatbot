'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a preliminary diagnosis based on user-provided symptoms.
 *
 * It includes:
 * - `generatePreliminaryDiagnosis`: An async function to generate a preliminary diagnosis.
 * - `GeneratePreliminaryDiagnosisInput`: The input type for the `generatePreliminaryDiagnosis` function.
 * - `GeneratePreliminaryDiagnosisOutput`: The output type for the `generatePreliminaryDiagnosis` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePreliminaryDiagnosisInputSchema = z.object({
  symptoms: z
    .string()
    .describe("The user's symptoms described in their local language."),
  language: z
    .string()
    .describe('The language in which the symptoms are described (e.g., hindi, tamil).'),
});
export type GeneratePreliminaryDiagnosisInput = z.infer<
  typeof GeneratePreliminaryDiagnosisInputSchema
>;

const GeneratePreliminaryDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('The AI-generated preliminary diagnosis in the specified language.'),
  confidenceLevel: z
    .number()
    .describe(
      'The confidence level of the diagnosis, ranging from 0 to 1, where 1 is the highest confidence.'
    ),
  urgencyAlert: z
    .string()
    .describe(
      'An alert indicating the urgency of seeking medical attention (e.g., \'Seek a doctor immediately\') in the specified language.'
    ),
  suggestedMedicines: z.string().describe('Suggested over-the-counter medicines for the symptoms, in the specified language.'),
  suggestedDoctors: z.string().describe('Types of specialists to consult for the given symptoms (e.g., General Physician, Cardiologist), in the specified language.'),
});
export type GeneratePreliminaryDiagnosisOutput = z.infer<
  typeof GeneratePreliminaryDiagnosisOutputSchema
>;

export async function generatePreliminaryDiagnosis(
  input: GeneratePreliminaryDiagnosisInput
): Promise<GeneratePreliminaryDiagnosisOutput> {
  return generatePreliminaryDiagnosisFlow(input);
}

const generatePreliminaryDiagnosisPrompt = ai.definePrompt({
  name: 'generatePreliminaryDiagnosisPrompt',
  input: {schema: GeneratePreliminaryDiagnosisInputSchema},
  output: {schema: GeneratePreliminaryDiagnosisOutputSchema},
  prompt: `You are an AI-powered diagnostic assistant that provides preliminary diagnoses based on user-provided symptoms.

The user will describe their symptoms in their local language. You will provide a preliminary diagnosis, a confidence level (0-1), an urgency alert, suggested over-the-counter medicines, and the type of doctor they should consult.

Symptoms: {{{symptoms}}}
Language: {{{language}}}

IMPORTANT: All text-based responses (diagnosis, urgencyAlert, suggestedMedicines, suggestedDoctors) MUST be in the SCRIPT of the specified 'language'. For example, if the language is 'hindi', the response must be in Hindi script.

Respond in valid JSON format.`,
});

const generatePreliminaryDiagnosisFlow = ai.defineFlow(
  {
    name: 'generatePreliminaryDiagnosisFlow',
    inputSchema: GeneratePreliminaryDiagnosisInputSchema,
    outputSchema: GeneratePreliminaryDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await generatePreliminaryDiagnosisPrompt(input);
    return output!;
  }
);
