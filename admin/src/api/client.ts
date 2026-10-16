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

/** 계약 §1.4의 에러 코드와 HTTP 상태를 그대로 싣는다. 네트워크 실패는 code `NETWORK`. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

/** 운영 사이트가 서버에 하는 일 전부 — 계약 §21.1 · §21.3. */
export interface ApiClient {
  login(idToken: string): Promise<AdminLoginResponse>;
  me(): Promise<AdminDTO>;

  searchUsers(q: string, signal?: AbortSignal): Promise<AdminUserDTO[]>;
  getUser(id: UUID): Promise<AdminUserDTO | null>;

  previewAudience(segment: AudienceSegment, signal?: AbortSignal): Promise<AudiencePreview>;
  listCampaigns(cursor?: string): Promise<Page<CampaignDTO>>;
  createCampaign(input: CampaignInput): Promise<CampaignDTO>;
  getCampaign(id: UUID): Promise<CampaignDTO>;
  updateCampaign(id: UUID, patch: Partial<CampaignInput>): Promise<CampaignDTO>;
  sendTest(id: UUID): Promise<{ sent: number }>;
  schedule(id: UUID, scheduledAt?: string): Promise<CampaignDTO>;
  cancel(id: UUID): Promise<CampaignDTO>;

  getTestRecipients(): Promise<AdminUserDTO[]>;
  setTestRecipients(userIds: UUID[]): Promise<AdminUserDTO[]>;
}

/** 검색어가 이 길이보다 짧으면 부르지 않는다(계약 §21.3). */
export const MIN_SEARCH_LENGTH = 2;
