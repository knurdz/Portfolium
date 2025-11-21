import { Client, Account, Databases } from "node-appwrite";
import { cookies } from "next/headers";

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
export const PORTFOLIOS_COLLECTION_ID = process.env.APPWRITE_PORTFOLIOS_COLLECTION_ID!;

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const cookieStore = await cookies();
  
  // Try the standard session cookie name first
  let session = cookieStore.get("appwrite-session");
  
  // If not found, try the Appwrite browser SDK cookie format
  if (!session || !session.value) {
    const sessionCookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
    session = cookieStore.get(sessionCookieName);
  }
  
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}
