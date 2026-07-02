import type { RawOpportunity, SourceAdapter } from "../../types";
import {
  fetchJson,
  getInitials,
  inferOpportunityType,
  stripHtml,
  validateOpportunity,
} from "./base";

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  content: string;
  updated_at: string;
  departments?: { name: string }[];
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

export function createGreenhouseAdapter(
  boardToken: string,
  organization: string,
  country?: string,
): SourceAdapter<GreenhouseJob, RawOpportunity> {
  return {
    id: `greenhouse-${boardToken}`,
    name: organization,
    async fetch() {
      const data = await fetchJson<GreenhouseResponse>(
        `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`,
      );
      return data.jobs ?? [];
    },
    normalize(raw): RawOpportunity | null {
      const description = stripHtml(raw.content ?? "");
      return {
        title: raw.title,
        organization,
        logo: null,
        location: raw.location?.name ?? "Remote",
        country: country ?? null,
        type: inferOpportunityType(raw.title, description),
        description: description.slice(0, 2000) || null,
        deadline: null,
        skills: [],
        salary: null,
        tags: (raw.departments ?? []).map((d) => d.name.toUpperCase()),
        apply_url: raw.absolute_url,
        source_url: raw.absolute_url,
        source_id: String(raw.id),
      };
    },
    validate: validateOpportunity,
  };
}

export const ionqAdapter = createGreenhouseAdapter("ionq", "IonQ", "USA");
export const rigettiAdapter = createGreenhouseAdapter("rigetti", "Rigetti", "USA");
export const xanaduAdapter = createGreenhouseAdapter("xanadu", "Xanadu", "Canada");
export const psiquantumAdapter = createGreenhouseAdapter("psiquantum", "PsiQuantum", "USA");

export function getLogoInitials(org: string): string {
  return getInitials(org);
}
