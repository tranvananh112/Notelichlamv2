import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import FastAppContainer from "@/components/fast-app-container"

export default async function AppPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user data using service_role client to bypass RLS for fetching user profile safely
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return <FastAppContainer user={user} isAdmin={userData?.is_admin || false} />
}
