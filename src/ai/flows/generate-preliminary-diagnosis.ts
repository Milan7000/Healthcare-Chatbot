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
    .describe('The language in which the symptoms are described.'),
});
export type GeneratePreliminaryDiagnosisInput = z.infer<
  typeof GeneratePreliminaryDiagnosisInputSchema
>;

const GeneratePreliminaryDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('The AI-generated preliminary diagnosis.'),
  confidenceLevel: z
    .number()
    .describe(
      'The confidence level of the diagnosis, ranging from 0 to 1, where 1 is the highest confidence.'
    ),
  urgencyAlert: z
    .string()
    .describe(
      'An alert indicating the urgency of seeking medical attention (e.g., \'Seek a doctor immediately\').'
    ),
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

  The user will describe their symptoms in their local language, and you will provide a preliminary diagnosis, a confidence level (0-1), and an urgency alert.

  Symptoms: {{{symptoms}}}
  Language: {{{language}}}

  Respond in the following format:
  {
    "diagnosis": "preliminary diagnosis",
    "confidenceLevel": 0.8,
    "urgencyAlert": "Seek a doctor immediately"
  }`,
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
