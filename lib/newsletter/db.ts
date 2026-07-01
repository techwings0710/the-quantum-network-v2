import { getSupabaseClient, getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import type { NewsletterSubscriber } from "../types";
import { isValidEmail } from "../utils";

export async function subscribeToNewsletter(
  email: string,
): Promise<{ success: boolean; message: string; subscriber?: NewsletterSubscriber }> {
  if (!isValidEmail(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, message: "Newsletter service is not configured." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, message: "Newsletter service is not available." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing?.active) {
    return { success: false, message: "This email is already subscribed." };
  }

  if (existing && !existing.active) {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({ active: true, subscribed_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to reactivate subscriber:", error.message);
      return { success: false, message: "Failed to subscribe. Please try again." };
    }

    return {
      success: true,
      message: "Welcome back! You have been resubscribed to our newsletter.",
      subscriber: data as NewsletterSubscriber,
    };
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: normalizedEmail })
    .select()
    .single();

  if (error) {
    console.error("Failed to subscribe:", error.message);
    return { success: false, message: "Failed to subscribe. Please try again." };
  }

  return {
    success: true,
    message: "Thank you for subscribing! You will receive our weekly briefing.",
    subscriber: data as NewsletterSubscriber,
  };
}

export async function getSubscriberCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  if (error) {
    console.error("Failed to get subscriber count:", error.message);
    return 0;
  }

  return count ?? 0;
}
