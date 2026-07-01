import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <div className="glass-card rounded-3xl p-xl max-w-lg mx-auto space-y-lg">
          <div className="flex items-center gap-md">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="w-16 h-16 rounded-full border border-white/10"
              />
            )}
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                {session.user.name ?? "My Profile"}
              </h1>
              <p className="text-on-surface-variant font-body-md">
                {session.user.email}
              </p>
            </div>
          </div>
          <p className="text-on-surface-variant font-body-md">
            Welcome to The Quantum Network. Your profile settings and preferences
            will be available here in a future update.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
