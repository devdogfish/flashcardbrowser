import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MarketingNav } from "@/components/marketing-nav";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  return (
    <>
      {!session && <MarketingNav />}
      {children}
    </>
  );
}
