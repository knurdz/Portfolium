"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Client, Account } from "node-appwrite";

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  const { account } = await createAdminClient();

  try {
    await account.create(ID.unique(), email, password, name);
    
    // Create session to send verification
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // Create a client with the new session to send verification
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setSession(session.secret);
      
    const accountSession = new Account(client);
    
    await accountSession.createVerification(`${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`);
    
  } catch (error) {
    console.error("Signup error:", error);
    const err = error as { code?: number; message?: string };
    if (err.code === 409) {
      return { error: "An account with this email already exists." };
    }
    return { error: err.message || "An error occurred during sign up. Please try again." };
  }

  redirect("/auth/check-email");
}

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (error) {
    console.error("Signin error:", error);
    const err = error as { code?: number; message?: string };
    if (err.code === 401) {
      return { error: "Invalid credentials. Please check your email and password." };
    }
    return { error: err.message || "An error occurred during sign in. Please try again." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const { account } = await createSessionClient();
  
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Signout error:", error);
  }
  
  (await cookies()).delete("appwrite-session");
  redirect("/auth/signin");
}

export async function signInWithOAuth(provider: string, prevState?: any, formData?: FormData) {
  redirect(
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account/sessions/oauth2/${provider}?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}&success=${process.env.NEXT_PUBLIC_APP_URL}/oauth&failure=${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=OAuth+cancelled`
  );
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Email is required" };
  }

  const { account } = await createAdminClient();

  try {
    await account.createRecovery(email, `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`);
  } catch (error) {
    console.error("Forgot password error:", error);
    const err = error as { message?: string };
    return { error: err.message || "An error occurred. Please try again." };
  }
  
  redirect("/auth/check-email");
}

export async function resetPassword(prevState: any, formData: FormData) {
  const userId = formData.get("userId") as string;
  const secret = formData.get("secret") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!userId || !secret) {
    return { error: "Invalid reset link. Please request a new password reset." };
  }

  if (!password || !confirmPassword) {
    return { error: "Password is required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { account } = await createAdminClient();

  try {
    await account.updateRecovery(userId, secret, password);
  } catch (error) {
    console.error("Reset password error:", error);
    const err = error as { code?: number; message?: string };
    if (err.code === 401) {
      return { error: "Invalid or expired reset link. Please request a new password reset." };
    }
    return { error: err.message || "An error occurred. Please try again." };
  }

  redirect("/auth/signin?success=Password+reset+successful");
}
