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
import { findNearbyHealthCenters } from '@/services/health-centers';

const GeneratePreliminaryDiagnosisInputSchema = z.object({
  symptoms: z
    .string()
    .describe("The user's symptoms described in their local language."),
  language: z
    .string()
    .describe('The language in which the symptoms are described (e.g., hindi, tamil).'),
  location: z.string().optional().describe("The user's current location as 'latitude,longitude'."),
});
export type GeneratePreliminaryDiagnosisInput = z.infer<
  typeof GeneratePreliminaryDiagnosisInputSchema
>;

const HealthCenterSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    specialty: z.string(),
});

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
  suggestedDoctors: z.string().describe('Types of specialists to consult for the given symptoms (e.g., General Physician, Cardiologist), in the specified language. This should be a type of doctor, not a specific person.'),
  nearbyHealthCenters: z.array(HealthCenterSchema).optional().describe('A list of nearby health centers or doctors with their contact information.'),
});
export type GeneratePreliminaryDiagnosisOutput = z.infer<
  typeof GeneratePreliminaryDiagnosisOutputSchema
>;

export async function generatePreliminaryDiagnosis(
  input: GeneratePreliminaryDiagnosisInput
): Promise<GeneratePreliminaryDiagnosisOutput> {
  return generatePreliminaryDiagnosisFlow(input);
}

const findDoctorsTool = ai.defineTool(
    {
        name: 'findNearbyDoctors',
        description: 'Finds nearby doctors or health centers based on the required specialty and user location.',
        inputSchema: z.object({
            specialty: z.string().describe("The medical specialty to search for (e.g., 'Cardiologist', 'General Physician')."),
            location: z.string().optional().describe("The user's current location as 'latitude,longitude'."),
        }),
        outputSchema: z.array(HealthCenterSchema),
    },
    async (input) => {
        if (!input.location) {
            return [];
        }
        // In a real app, you would use the location and specialty to query a database or external API.
        // For this demo, we use a mock service.
        return findNearbyHealthCenters(input.specialty);
    }
);


const generatePreliminaryDiagnosisPrompt = ai.definePrompt({
  name: 'generatePreliminaryDiagnosisPrompt',
  input: {schema: GeneratePreliminaryDiagnosisInputSchema},
  output: {schema: GeneratePreliminaryDiagnosisOutputSchema},
  tools: [findDoctorsTool],
  prompt: `You are an AI-powered diagnostic assistant. Your primary goal is to provide a preliminary diagnosis based on user-provided symptoms and suggest the appropriate next steps.

The user will describe their symptoms in their local language. You will provide:
1.  A preliminary diagnosis.
2.  A confidence level (from 0 to 1).
3.  An urgency alert.
4.  Suggested over-the-counter medicines.
5.  The type of specialist they should consult (e.g., 'General Physician', 'Cardiologist').

After determining the specialist, if the user has provided their location, you MUST use the 'findNearbyDoctors' tool to find relevant health centers. Pass the determined specialist type to the tool.

Symptoms: {{{symptoms}}}
Language: {{{language}}}
{{#if location}}
User Location: {{{location}}}
{{/if}}

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
