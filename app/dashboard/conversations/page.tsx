import { createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ConversationsClient from "./ConversationsClient";

export default async function Conversations() {
  let user;
  try {
    const { account } = await createSessionClient();
    user = await account.get();
  } catch {
    redirect("/auth/signin");
    return null;
  }

  if (!user.emailVerification) {
    redirect("/auth/check-email?error=Please+verify+your+email+to+access+the+dashboard");
    return null;
  }

  return (
    <DashboardLayout user={user}>
      <ConversationsClient />
    </DashboardLayout>
  );
}
