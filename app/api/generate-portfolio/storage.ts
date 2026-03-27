// Shared in-memory storage for generation status
// Use globalThis to persist during HMR in development
const globalForGeneration = globalThis as unknown as {
  generationStatus: Map<string, {
    status: 'processing' | 'completed' | 'failed';
    portfolio?: string;
    error?: string;
    provider?: string;
  }>;
};

export const generationStatus = globalForGeneration.generationStatus || new Map();

if (process.env.NODE_ENV !== 'production') {
  globalForGeneration.generationStatus = generationStatus;
}

// Generate unique job ID
export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
