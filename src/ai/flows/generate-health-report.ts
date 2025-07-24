'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a health report based on user symptoms and AI diagnosis.
 *
 * - generateHealthReport - A function that generates a health report.
 * - GenerateHealthReportInput - The input type for the generateHealthReport function.
 * - GenerateHealthReportOutput - The return type for the generateHealthReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthReportInputSchema = z.object({
  symptoms: z.string().describe('A summary of the patient\'s symptoms.'),
  diagnosis: z.string().describe('The AI\'s preliminary diagnosis.'),
  riskLevel: z.string().describe('The risk level associated with the diagnosis (e.g., low, medium, high).'),
  recommendation: z.string().describe('A recommendation for seeking medical attention (e.g., see a doctor).'),
  language: z.string().describe('The language for the report (e.g., hindi, tamil). The report must be in this language.'),
});
export type GenerateHealthReportInput = z.infer<typeof GenerateHealthReportInputSchema>;

const GenerateHealthReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive health report summarizing symptoms, diagnosis, risk level, and recommendations.'),
});
export type GenerateHealthReportOutput = z.infer<typeof GenerateHealthReportOutputSchema>;

export async function generateHealthReport(input: GenerateHealthReportInput): Promise<GenerateHealthReportOutput> {
  return generateHealthReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthReportPrompt',
  input: {schema: GenerateHealthReportInputSchema},
  output: {schema: GenerateHealthReportOutputSchema},
  prompt: `You are an AI assistant that generates a health report based on the following information:

Symptoms: {{{symptoms}}}
Diagnosis: {{{diagnosis}}}
Risk Level: {{{riskLevel}}}
Recommendation: {{{recommendation}}}

Generate a concise and easy-to-understand health report IN THE SCRIPT of the requested language: {{{language}}}. For example, if the language is 'hindi', the response must be in Hindi script. The report should include a brief overview of the symptoms, the AI's diagnosis, the associated risk level, and the recommendation for seeking medical attention.`,
});

const generateHealthReportFlow = ai.defineFlow(
  {
    name: 'generateHealthReportFlow',
    inputSchema: GenerateHealthReportInputSchema,
    outputSchema: GenerateHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
