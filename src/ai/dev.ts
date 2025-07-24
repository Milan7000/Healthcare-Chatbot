import { config } from 'dotenv';
config();

import '@/ai/flows/generate-health-report.ts';
import '@/ai/flows/generate-preliminary-diagnosis.ts';
import '@/ai/flows/analyze-medical-image.ts';
