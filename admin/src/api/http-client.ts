import { ApiError, type ApiClient } from "./client";
import type {
  AdminDTO,
  AdminLoginResponse,
  AdminUserDTO,
  AudiencePreview,
  AudienceSegment,
  CampaignDTO,
  CampaignInput,
  Page,
  UUID,
} from "./types";

export interface HttpApiClientOptions {
  /** 예: https://api.syncrunlabs.com/api/v1 */
  baseUrl: string;
  getToken: () => string | null;
  /** 401을 받으면 부른다 — 토큰을 버리고 로그인으로 보낸다. */
  onUnauthorized: () => void;
  fetchImpl?: typeof fetch;
}

interface ErrorEnvelope {
  error?: { code?: string; message?: string };
}

/** 응답 봉투 `{data}` · `{error}`(계약 §1.3)를 벗기는 fetch 구현. */
export class HttpApiClient implements ApiClient {
  private readonly options: HttpApiClientOptions;

  constructor(options: HttpApiClientOptions) {
    this.options = options;
  }

  private async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const { baseUrl, getToken, onUnauthorized } = this.options;
    const fetchImpl = this.options.fetchImpl ?? fetch;
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}/admin${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      throw new ApiError("NETWORK", 0, error instanceof Error ? error.message : String(error));
    }

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      const error = (payload as ErrorEnvelope | null)?.error;
      throw new ApiError(error?.code ?? "INTERNAL", response.status, error?.message ?? response.statusText);
    }
    return (payload as { data: T }).data;
  }

  login(idToken: string): Promise<AdminLoginResponse> {
    return this.request("POST", "/auth/google", { idToken });
  }

  me(): Promise<AdminDTO> {
    return this.request("GET", "/me");
  }

  async searchUsers(q: string, signal?: AbortSignal): Promise<AdminUserDTO[]> {
    const page = await this.request<{ items: AdminUserDTO[] }>(
      "GET",
      `/users/search?q=${encodeURIComponent(q)}`,
      undefined,
      signal,
    );
    return page.items;
  }

  async getUser(id: UUID): Promise<AdminUserDTO | null> {
    const users = await this.searchUsers(id);
    return users.find((user) => user.id === id) ?? null;
  }

  previewAudience(segment: AudienceSegment, signal?: AbortSignal): Promise<AudiencePreview> {
    return this.request("POST", "/push/audience/preview", { segment }, signal);
  }

  listCampaigns(cursor?: string): Promise<Page<CampaignDTO>> {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    return this.request("GET", `/push/campaigns${query}`);
  }

  createCampaign(input: CampaignInput): Promise<CampaignDTO> {
    return this.request("POST", "/push/campaigns", input);
  }

  getCampaign(id: UUID): Promise<CampaignDTO> {
    return this.request("GET", `/push/campaigns/${id}`);
  }

  updateCampaign(id: UUID, patch: Partial<CampaignInput>): Promise<CampaignDTO> {
    return this.request("PATCH", `/push/campaigns/${id}`, patch);
  }

  sendTest(id: UUID): Promise<{ sent: number }> {
    return this.request("POST", `/push/campaigns/${id}/test`);
  }

  schedule(id: UUID, scheduledAt?: string): Promise<CampaignDTO> {
    return this.request("POST", `/push/campaigns/${id}/schedule`, scheduledAt ? { scheduledAt } : {});
  }

  cancel(id: UUID): Promise<CampaignDTO> {
    return this.request("POST", `/push/campaigns/${id}/cancel`);
  }

  async getTestRecipients(): Promise<AdminUserDTO[]> {
    return (await this.request<{ items: AdminUserDTO[] }>("GET", "/test-recipients")).items;
  }

  async setTestRecipients(userIds: UUID[]): Promise<AdminUserDTO[]> {
    return (await this.request<{ items: AdminUserDTO[] }>("PUT", "/test-recipients", { userIds })).items;
  }
}
