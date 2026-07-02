import type { RawOpportunity, SourceAdapter } from "../../types";
import {
  fetchJson,
  inferOpportunityType,
  stripHtml,
  validateOpportunity,
} from "./base";

interface MicrosoftJob {
  jobId: string;
  title: string;
  description: string;
  primaryLocation: string;
  postingDate: string;
  applyUrl: string;
}

interface MicrosoftResponse {
  operationResult?: {
    result?: {
      jobs?: MicrosoftJob[];
    };
  };
}

export const microsoftAdapter: SourceAdapter<MicrosoftJob, RawOpportunity> = {
  id: "microsoft-careers",
  name: "Microsoft",
  async fetch() {
    const data = await fetchJson<MicrosoftResponse>(
      "https://gcsservices.careers.microsoft.com/search/api/v1/search?keywords=quantum&page=1&pageSize=50&o=Relevance",
    );
    return data.operationResult?.result?.jobs ?? [];
  },
  normalize(raw): RawOpportunity | null {
    const description = stripHtml(raw.description ?? "");
    const applyUrl = raw.applyUrl.startsWith("http")
      ? raw.applyUrl
      : `https://careers.microsoft.com${raw.applyUrl}`;

    return {
      title: raw.title,
      organization: "Microsoft",
      location: raw.primaryLocation ?? "Remote",
      country: raw.primaryLocation?.includes("India") ? "India" : null,
      type: inferOpportunityType(raw.title, description),
      description: description.slice(0, 2000) || null,
      apply_url: applyUrl,
      source_url: applyUrl,
      source_id: raw.jobId,
      tags: ["QUANTUM", "MICROSOFT"],
    };
  },
  validate: validateOpportunity,
};

interface IbmJob {
  job_id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  state: string;
  url: string;
}

interface IbmResponse {
  jobs?: IbmJob[];
}

export const ibmAdapter: SourceAdapter<IbmJob, RawOpportunity> = {
  id: "ibm-careers",
  name: "IBM",
  async fetch() {
    const data = await fetchJson<IbmResponse>(
      "https://careers.ibm.com/api/apply/v2/jobs?domain=ibm.com&keywords=quantum&page=1&pageSize=50",
    );
    return data.jobs ?? [];
  },
  normalize(raw): RawOpportunity | null {
    const description = stripHtml(raw.description ?? "");
    const location = [raw.city, raw.state, raw.country].filter(Boolean).join(", ");
    const applyUrl = raw.url.startsWith("http")
      ? raw.url
      : `https://careers.ibm.com${raw.url}`;

    return {
      title: raw.title,
      organization: "IBM",
      location: location || "Remote",
      country: raw.country ?? null,
      type: inferOpportunityType(raw.title, description),
      description: description.slice(0, 2000) || null,
      apply_url: applyUrl,
      source_url: applyUrl,
      source_id: raw.job_id,
      tags: ["QUANTUM", "IBM"],
    };
  },
  validate: validateOpportunity,
};

interface AmazonJob {
  id: string;
  title: string;
  description: string;
  city: string;
  country_code: string;
  job_path: string;
}

interface AmazonResponse {
  jobs?: AmazonJob[];
}

export const amazonAdapter: SourceAdapter<AmazonJob, RawOpportunity> = {
  id: "amazon-careers",
  name: "Amazon",
  async fetch() {
    const data = await fetchJson<AmazonResponse>(
      "https://www.amazon.jobs/en/search.json?base_query=quantum&page=1&result_limit=50",
    );
    return data.jobs ?? [];
  },
  normalize(raw): RawOpportunity | null {
    const description = stripHtml(raw.description ?? "");
    const applyUrl = `https://www.amazon.jobs${raw.job_path}`;

    return {
      title: raw.title,
      organization: "Amazon",
      location: raw.city ?? "Remote",
      country: raw.country_code ?? null,
      type: inferOpportunityType(raw.title, description),
      description: description.slice(0, 2000) || null,
      apply_url: applyUrl,
      source_url: applyUrl,
      source_id: raw.id,
      tags: ["QUANTUM", "AMAZON"],
    };
  },
  validate: validateOpportunity,
};

interface GoogleJob {
  id: string;
  title: string;
  description: string;
  locations: string[];
  apply_url: string;
}

interface GoogleResponse {
  jobs?: GoogleJob[];
}

export const googleAdapter: SourceAdapter<GoogleJob, RawOpportunity> = {
  id: "google-careers",
  name: "Google",
  async fetch() {
    const data = await fetchJson<GoogleResponse>(
      "https://careers.google.com/api/v3/search/?company=Google&page=1&q=quantum",
    );
    return data.jobs ?? [];
  },
  normalize(raw): RawOpportunity | null {
    const description = stripHtml(raw.description ?? "");
    const applyUrl = raw.apply_url.startsWith("http")
      ? raw.apply_url
      : `https://careers.google.com${raw.apply_url}`;

    return {
      title: raw.title,
      organization: "Google",
      location: raw.locations?.[0] ?? "Remote",
      country: raw.locations?.some((l) => l.includes("India")) ? "India" : null,
      type: inferOpportunityType(raw.title, description),
      description: description.slice(0, 2000) || null,
      apply_url: applyUrl,
      source_url: applyUrl,
      source_id: raw.id,
      tags: ["QUANTUM", "GOOGLE"],
    };
  },
  validate: validateOpportunity,
};

interface NvidiaJob {
  jobId: string;
  title: string;
  locationsText: string;
  postedDate: string;
  externalPath: string;
}

interface NvidiaResponse {
  jobPostings?: NvidiaJob[];
}

export const nvidiaAdapter: SourceAdapter<NvidiaJob, RawOpportunity> = {
  id: "nvidia-careers",
  name: "NVIDIA",
  async fetch() {
    const data = await fetchJson<NvidiaResponse>(
      "https://nvidia.wd5.myworkdayjobs.com/wday/cxs/nvidia/NVIDIAExternalCareerSite/jobs?keyword=quantum&limit=50",
    );
    return data.jobPostings ?? [];
  },
  normalize(raw): RawOpportunity | null {
    const applyUrl = `https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite${raw.externalPath}`;

    return {
      title: raw.title,
      organization: "NVIDIA",
      location: raw.locationsText ?? "Remote",
      type: inferOpportunityType(raw.title, ""),
      description: null,
      apply_url: applyUrl,
      source_url: applyUrl,
      source_id: raw.jobId,
      tags: ["QUANTUM", "NVIDIA"],
    };
  },
  validate: validateOpportunity,
};
