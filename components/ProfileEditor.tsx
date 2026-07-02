"use client";

import { useState } from "react";
import type { NotificationPreferences, UserProfile } from "@/lib/types";

interface ProfileEditorProps {
  profile: UserProfile;
  sessionEmail: string;
  sessionImage: string | null;
  savedArticlesCount: number;
}

export function ProfileEditor({
  profile,
  sessionEmail,
  sessionImage,
  savedArticlesCount,
}: ProfileEditorProps) {
  const [name, setName] = useState(profile.name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [organization, setOrganization] = useState(profile.organization ?? "");
  const [country, setCountry] = useState(profile.country ?? "");
  const [researchInterests, setResearchInterests] = useState(
    profile.research_interests.join(", "),
  );
  const [favouriteTopics, setFavouriteTopics] = useState(
    profile.favourite_topics.join(", "),
  );
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    profile.notification_preferences,
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          organization,
          country,
          research_interests: researchInterests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          favourite_topics: favouriteTopics
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          notification_preferences: notifications,
        }),
      });

      if (response.ok) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSyncGoogle() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", { method: "POST" });
      if (response.ok) {
        const synced = (await response.json()) as UserProfile;
        setName(synced.name ?? "");
        setMessage("Google profile synced.");
      } else {
        setMessage("Failed to sync Google profile.");
      }
    } catch {
      setMessage("Failed to sync Google profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-lg">
      <div className="flex items-center gap-md">
        {(sessionImage ?? profile.image) && (
          <img
            src={sessionImage ?? profile.image ?? ""}
            alt={name || "User"}
            className="w-16 h-16 rounded-full border border-white/10"
          />
        )}
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            {name || "My Profile"}
          </h1>
          <p className="text-on-surface-variant font-body-md">{sessionEmail}</p>
        </div>
      </div>

      <p className="text-on-surface-variant font-body-md">
        Welcome to The Quantum Network. Manage your profile settings and
        preferences below.
      </p>

      <div className="space-y-md">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Display Name
          </label>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Email
          </label>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface-variant"
            value={sessionEmail}
            disabled
          />
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Bio
          </label>
          <textarea
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface min-h-[100px]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
            Country
          </label>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Research Interests (comma-separated)
          </label>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={researchInterests}
            onChange={(e) => setResearchInterests(e.target.value)}
          />
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
            Favourite Topics (comma-separated)
          </label>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface"
            value={favouriteTopics}
            onChange={(e) => setFavouriteTopics(e.target.value)}
          />
        </div>

        <div className="space-y-sm">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Notification Preferences
          </p>
          {(["newsletter", "opportunities", "events"] as const).map((key) => (
            <label key={key} className="flex items-center gap-sm text-on-surface font-body-md">
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [key]: e.target.checked })
                }
                className="accent-primary"
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-md space-y-sm">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          ACTIVITY
        </p>
        <p className="text-on-surface font-body-md">
          Saved Articles: {savedArticlesCount}
        </p>
      </div>

      <div className="flex gap-sm flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <button
          onClick={handleSyncGoogle}
          disabled={saving}
          className="border border-white/10 text-on-surface px-5 py-2 rounded-full font-label-md hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          Sync Google Profile
        </button>
      </div>

      {message && (
        <p className="text-primary font-body-md">{message}</p>
      )}
    </div>
  );
}
