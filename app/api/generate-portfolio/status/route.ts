import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, DATABASE_ID, JOBS_COLLECTION_ID } from "@/lib/appwrite";
import { generationStatus } from "../storage";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId");

    console.log(`[Status Check] jobId: ${jobId}`);

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    // Try to get job from database first
    try {
      const { databases } = await createAdminClient();
      const job = await databases.getDocument(
        DATABASE_ID,
        JOBS_COLLECTION_ID,
        jobId
      );

      console.log(`[Status Check] Job ${jobId} status from database:`, job.status);

      // Return job data
      const response: {
        status: string;
        portfolio?: string;
        provider?: string;
        error?: string;
      } = {
        status: job.status
      };

      if (job.status === 'completed') {
        response.portfolio = job.portfolio;
        response.provider = job.provider;
      } else if (job.status === 'failed') {
        response.error = job.error;
      }

      return NextResponse.json(response);
    } catch (dbError: unknown) {
      const err = dbError as { code?: number; type?: string; message?: string };
      console.log(`[Status Check] Database check failed (${err.message}), trying in-memory storage...`);
      
      // Fallback to in-memory storage
      const memoryStatus = generationStatus.get(jobId);
      
      if (memoryStatus) {
        console.log(`[Status Check] Job ${jobId} found in memory, status:`, memoryStatus.status);
        return NextResponse.json(memoryStatus);
      }
      
      console.log(`[Status Check] Job ${jobId} not found in database or memory`);
      console.log(`[Status Check] Available jobs in memory:`, Array.from(generationStatus.keys()));
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("[Status Check] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
