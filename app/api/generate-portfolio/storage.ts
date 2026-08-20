// Shared in-memory storage for generation status
// Use globalThis to persist during HMR in development and across module reloads
const globalForGeneration = globalThis as unknown as {
  generationStatus: Map<string, {
    status: 'processing' | 'completed' | 'failed';
    portfolio?: string;
    error?: string;
    provider?: string;
    createdAt?: number;
  }>;
};

export const generationStatus = globalForGeneration.generationStatus || new Map();

// Always persist to globalThis (not just in dev) to survive module reloads
globalForGeneration.generationStatus = generationStatus;

// Auto-cleanup old jobs (TTL: 10 minutes) to prevent memory leaks
const JOB_TTL_MS = 10 * 60 * 1000;

export function cleanupOldJobs(): void {
  const now = Date.now();
  for (const [jobId, job] of generationStatus.entries()) {
    if (job.createdAt && now - job.createdAt > JOB_TTL_MS) {
      generationStatus.delete(jobId);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldJobs, 5 * 60 * 1000);
}

// Generate unique job ID
export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
