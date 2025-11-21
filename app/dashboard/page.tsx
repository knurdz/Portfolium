import { createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserPortfolio } from "@/lib/actions/portfolio";

export default async function Dashboard() {
  let user;
  try {
    const { account } = await createSessionClient();
    user = await account.get();
  } catch {
    redirect("/auth/signin");
    return null;
  }

  // Check if user is verified
  if (!user.emailVerification) {
    redirect("/auth/check-email?error=Please+verify+your+email+to+access+the+dashboard");
    return null;
  }

  // Fetch user's existing portfolio if any
  const existingPortfolio = await getUserPortfolio();

  return (
    <DashboardLayout 
      user={user} 
      existingPortfolio={existingPortfolio ? {
        subdomain: existingPortfolio.subdomain,
        htmlContent: existingPortfolio.htmlContent
      } : null}
    />
  );
}
