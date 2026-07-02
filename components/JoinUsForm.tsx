"use client";

import { FormEvent, useState } from "react";

export function JoinUsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/join-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          organization,
          role,
          area_of_interest: areaOfInterest,
          message,
        }),
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (response.ok) {
        setFeedback("Thank you! Your application has been submitted.");
        setName("");
        setEmail("");
        setCountry("");
        setOrganization("");
        setRole("");
        setAreaOfInterest("");
        setMessage("");
      } else {
        setFeedback(data.error ?? "Failed to submit application.");
      }
    } catch {
      setFeedback("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-xl space-y-md">
      <h2 className="font-headline-md text-headline-md">Application Form</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Name *
          </label>
          <input
            required
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Email *
          </label>
          <input
            required
            type="email"
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Country *
          </label>
          <input
            required
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Organisation
          </label>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Role *
          </label>
          <select
            required
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="Student Ambassador">Student Ambassador</option>
            <option value="Researcher">Researcher</option>
            <option value="Industry Mentor">Industry Mentor</option>
            <option value="Content Contributor">Content Contributor</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Area of Interest *
          </label>
          <input
            required
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={areaOfInterest}
            onChange={(e) => setAreaOfInterest(e.target.value)}
            placeholder="e.g. Quantum Algorithms, QKD, Photonics"
          />
        </div>
      </div>

      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
          Message
        </label>
        <textarea
          className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us why you'd like to join The Quantum Network..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>

      {feedback && (
        <p className={`font-body-md ${feedback.includes("Thank") ? "text-primary" : "text-error"}`}>
          {feedback}
        </p>
      )}
    </form>
  );
}
