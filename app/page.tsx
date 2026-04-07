import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { StudyPage } from "@/components/study-page"

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <StudyPage
      userName={session.user.name}
      userEmail={session.user.email}
      userImage={session.user.image}
    />
  )
}
