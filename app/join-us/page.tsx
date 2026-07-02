import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JoinUsForm } from "@/components/JoinUsForm";
import { NewsletterSection } from "@/components/NewsletterSection";

const COMMUNITY_ROLES = [
  {
    title: "Student Ambassadors",
    description:
      "Represent The Quantum Network on campus. Organise meetups, workshops, and quantum computing study groups.",
  },
  {
    title: "Researchers",
    description:
      "Contribute research highlights, paper summaries, and academic insights to our research section.",
  },
  {
    title: "Industry Mentors",
    description:
      "Guide students and early-career professionals navigating the quantum technology ecosystem.",
  },
  {
    title: "Content Contributors",
    description:
      "Write editorial content, interview leaders, and help shape the narrative of India's quantum journey.",
  },
  {
    title: "Volunteer Programme",
    description:
      "Support community events, content moderation, and platform growth initiatives across India.",
  },
];

export default function JoinUsPage() {
  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <section className="space-y-md border-b border-white/5 pb-sm">
          <h1 className="font-headline-lg text-headline-lg">Join Us</h1>
          <p className="text-on-surface-variant font-body-md max-w-3xl">
            Be part of India&apos;s leading quantum technology community. Whether
            you&apos;re a student, researcher, industry professional, or
            enthusiast — there&apos;s a place for you in The Quantum Network.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="glass-card rounded-2xl p-xl space-y-md">
            <h2 className="font-headline-md text-headline-md">Our Mission</h2>
            <p className="text-on-surface-variant font-body-md">
              To democratise access to quantum technology knowledge, connect
              India&apos;s quantum ecosystem, and accelerate the nation&apos;s
              leadership in the quantum revolution.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-xl space-y-md">
            <h2 className="font-headline-md text-headline-md">Our Vision</h2>
            <p className="text-on-surface-variant font-body-md">
              A thriving, interconnected quantum community where researchers,
              industry leaders, policymakers, and students collaborate to shape
              the future of quantum technology in India and beyond.
            </p>
          </div>
        </section>

        <section className="space-y-md">
          <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
            Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {COMMUNITY_ROLES.map((role) => (
              <div key={role.title} className="glass-card rounded-xl p-md space-y-sm">
                <h3 className="font-headline-md text-base text-on-surface">
                  {role.title}
                </h3>
                <p className="text-on-surface-variant text-sm">{role.description}</p>
              </div>
            ))}
          </div>
        </section>

        <JoinUsForm />
      </main>
      <NewsletterSection />
      <Footer />
    </>
  );
}
