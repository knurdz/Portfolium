// Shared in-memory storage for generation status
// In production, replace with Redis or a database
export const generationStatus = new Map<string, {
  status: 'processing' | 'completed' | 'failed';
  portfolio?: string;
  error?: string;
  provider?: string;
}>();

// Generate unique job ID
export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
