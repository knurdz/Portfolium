"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Client, Account } from "node-appwrite";

interface FormState {
  error?: string;
}

export async function signUp(_prevState: FormState | null, formData: FormData): Promise<FormState | never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Debug logging
  console.log("SignUp attempt:", { email, name, hasPassword: !!password, hasConfirmPassword: !!confirmPassword });

  if (!email || !password || !name) {
    console.log("Missing fields:", { email: !!email, password: !!password, name: !!name });
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    console.log("Password mismatch");
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    console.log("Password too short:", password.length);
    return { error: "Password must be at least 8 characters long" };
  }

  if (password.length > 256) {
    return { error: "Password must be less than 256 characters" };
  }

  // Validate password strength (Appwrite requirements)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return { error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
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
    const err = error as { code?: number; message?: string; type?: string; response?: { message?: string; code?: number } };
    
    // Log the complete error object
    console.log("Error code:", err.code);
    console.log("Error message:", err.message);
    console.log("Error type:", err.type);
    console.log("Error response:", err.response);
    
    if (err.code === 409) {
      return { error: "An account with this email already exists." };
    }
    
    if (err.code === 400) {
      // More specific error messages for 400 errors
      const message = err.response?.message || err.message || "";
      console.log("400 error message:", message);
      
      if (message.toLowerCase().includes("password")) {
        return { error: "Password must be 8-256 characters with at least one uppercase, lowercase, number and special character." };
      }
      if (message.toLowerCase().includes("email")) {
        return { error: "Please enter a valid email address." };
      }
      if (message.toLowerCase().includes("name")) {
        return { error: "Please enter a valid name (letters and spaces only)." };
      }
      
      // Return the actual Appwrite error message if available
      return { error: message || "Invalid input. Please check your details and try again." };
    }
    
    // Log full error for debugging
    console.error("Full error details:", JSON.stringify(err, null, 2));
    
    return { error: err.message || "An error occurred during sign up. Please try again." };
  }

  redirect("/auth/check-email");
}

export async function signIn(_prevState: FormState | null, formData: FormData): Promise<FormState | never> {
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

export async function signInWithOAuth(provider: string): Promise<never> {
  redirect(
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account/sessions/oauth2/${provider}?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}&success=${process.env.NEXT_PUBLIC_APP_URL}/oauth&failure=${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?error=OAuth+cancelled`
  );
}

export async function forgotPassword(_prevState: FormState | null, formData: FormData): Promise<FormState | never> {
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

export async function resetPassword(_prevState: FormState | null, formData: FormData): Promise<FormState | never> {
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
