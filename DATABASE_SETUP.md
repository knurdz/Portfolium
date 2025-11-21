# Database Setup Guide

## Appwrite Collections Setup

### 1. Generation Jobs Collection

You need to create a new collection in your Appwrite database to track portfolio generation jobs.

**Collection Details:**
- **Collection ID:** `generation_jobs`
- **Collection Name:** Generation Jobs
- **Database ID:** Use your existing database ID (`691de530000fd3401b09`)

**Attributes to create:**

1. **status** (String, Required)
   - Size: 20
   - Default: `processing`
   - Values: `processing`, `completed`, `failed`

2. **portfolio** (String, Optional)
   - Size: 1000000 (1MB for large HTML content)
   - Only populated when status is `completed`

3. **provider** (String, Optional)
   - Size: 100
   - The AI provider used (e.g., "Gemini 2.5 Flash", "Groq Llama 3.3")

4. **error** (String, Optional)
   - Size: 500
   - Error message when status is `failed`

5. **createdAt** (DateTime, Required)
   - The timestamp when job was created

6. **updatedAt** (DateTime, Required)
   - The timestamp when job was last updated

**Indexes:**
- Create an index on `createdAt` for cleanup queries (optional but recommended)

**Permissions:**
- **Create:** Any (for API to create jobs)
- **Read:** Any (for API to check status)
- **Update:** Any (for API to update status)
- **Delete:** Any (for cleanup)

### 2. How to Create the Collection

1. Go to your Appwrite Console: https://cloud.appwrite.io/
2. Navigate to your project
3. Click on "Databases" → Select your database (`691de530000fd3401b09`)
4. Click "Create Collection"
5. Enter Collection ID: `generation_jobs`
6. Add all attributes as specified above
7. Set permissions to "Any" for Create, Read, Update, Delete
8. Save the collection

### 3. Cleanup Jobs (Optional)

To prevent the database from growing too large, you can set up a cleanup function:

**Option A: Manual Cleanup**
- Periodically delete jobs older than 24 hours using Appwrite Console

**Option B: Automated Cleanup (Recommended)**
- Create an Appwrite Function that runs daily
- Delete jobs where `createdAt` is older than 24-48 hours
- This keeps your database clean and performant

**Option C: TTL on Documents**
- When creating documents, you can manually implement a cleanup endpoint
- Call it periodically via cron job

### Why Database Instead of In-Memory?

The previous in-memory `Map` approach had issues:
- ❌ Jobs lost on server restart
- ❌ Doesn't work with multiple server instances
- ❌ Not suitable for serverless/edge deployments (like Vercel)
- ❌ Jobs cleaned up too quickly

With database storage:
- ✅ Jobs persist across server restarts
- ✅ Works with multiple instances (serverless/edge)
- ✅ Jobs available until explicitly cleaned up
- ✅ Better for production deployment on Vercel/Netlify
- ✅ Can track job history and analytics

### Environment Variables

Make sure your `.env.local` includes:

```env
APPWRITE_DATABASE_ID=691de530000fd3401b09
APPWRITE_PORTFOLIOS_COLLECTION_ID=userdata
APPWRITE_JOBS_COLLECTION_ID=generation_jobs
```
