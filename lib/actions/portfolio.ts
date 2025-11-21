"use server";

import { createSessionClient, createAdminClient, DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";

export interface Portfolio {
  $id: string;
  userId: string;
  subdomain: string;
  htmlContent: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Check if a subdomain is available
 */
export async function checkSubdomainAvailability(subdomain: string): Promise<{ available: boolean; error?: string }> {
  try {
    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      return {
        available: false,
        error: "Subdomain must contain only lowercase letters, numbers, and hyphens (not at start/end)"
      };
    }

    if (subdomain.length < 3 || subdomain.length > 63) {
      return {
        available: false,
        error: "Subdomain must be between 3 and 63 characters"
      };
    }

    // Reserved subdomains
    const reserved = ["www", "api", "admin", "app", "dashboard", "mail", "smtp", "ftp", "test", "dev", "staging"];
    if (reserved.includes(subdomain)) {
      return {
        available: false,
        error: "This subdomain is reserved"
      };
    }

    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      [Query.equal("subdomain", subdomain)]
    );

    return { available: result.documents.length === 0 };
  } catch (error) {
    console.error("Error checking subdomain:", error);
    return { available: false, error: "Failed to check subdomain availability" };
  }
}

/**
 * Save or update a portfolio
 */
export async function savePortfolio(
  subdomain: string,
  htmlContent: string
): Promise<{ success: boolean; portfolioId?: string; error?: string; url?: string }> {
  try {
    // Get user from session
    const { account: sessionAccount } = await createSessionClient();
    const user = await sessionAccount.get();

    // Use admin client for database operations
    const { databases } = await createAdminClient();

    // Check if user already has a portfolio
    const existing = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    if (existing.documents.length > 0) {
      // Update existing portfolio
      const portfolioId = existing.documents[0].$id;
      await databases.updateDocument(
        DATABASE_ID,
        PORTFOLIOS_COLLECTION_ID,
        portfolioId,
        {
          subdomain,
          htmlContent,
        }
      );

      return {
        success: true,
        portfolioId,
        url: `https://${subdomain}.portfolium.knurdz.org`
      };
    } else {
      // Create new portfolio
      const portfolio = await databases.createDocument(
        DATABASE_ID,
        PORTFOLIOS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          subdomain,
          htmlContent,
        }
      );

      return {
        success: true,
        portfolioId: portfolio.$id,
        url: `https://${subdomain}.portfolium.knurdz.org`
      };
    }
  } catch (error: unknown) {
    console.error("Error saving portfolio:", error);
    const err = error as Error;
    return { success: false, error: err.message || "Failed to save portfolio" };
  }
}

/**
 * Get portfolio by subdomain (public access)
 */
export async function getPortfolioBySubdomain(subdomain: string): Promise<Portfolio | null> {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      [Query.equal("subdomain", subdomain)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    return result.documents[0] as unknown as Portfolio;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
}

/**
 * Get current user's portfolio
 */
export async function getUserPortfolio(): Promise<Portfolio | null> {
  try {
    // Get user from session
    const { account: sessionAccount } = await createSessionClient();
    const user = await sessionAccount.get();

    // Use admin client for database read
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    return result.documents[0] as unknown as Portfolio;
  } catch (error) {
    console.error("Error fetching user portfolio:", error);
    return null;
  }
}

/**
 * Delete current user's portfolio
 */
export async function deletePortfolio(): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user from session
    const { account: sessionAccount } = await createSessionClient();
    const user = await sessionAccount.get();

    // Use admin client for database operations
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    if (result.documents.length > 0) {
      await databases.deleteDocument(
        DATABASE_ID,
        PORTFOLIOS_COLLECTION_ID,
        result.documents[0].$id
      );
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting portfolio:", error);
    const err = error as Error;
    return { success: false, error: err.message || "Failed to delete portfolio" };
  }
}
