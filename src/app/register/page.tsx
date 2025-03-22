import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRegisterForm } from "@/components/user-register-form"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default async function RegisterPage() {
    // if user is logged in redirect to home page
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error || data?.user) {
      redirect("/");
    }
  
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="mx-auto max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Sign up to get started with PureFarm Market</CardDescription>
            </CardHeader>
            <CardContent>
              <UserRegisterForm />
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline text-green-600">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  )
}

