import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  const user = session.user as {
    email: string;
    dalEmail?: string | null;
    fieldOfStudy?: string | null;
  };

  // Dev bypass for seed accounts
  const isSeedUser =
    process.env.NODE_ENV === "development" &&
    user.email.endsWith("@flashcardbrowser.com");

  if (!isSeedUser && (!user.fieldOfStudy || !user.dalEmail)) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
