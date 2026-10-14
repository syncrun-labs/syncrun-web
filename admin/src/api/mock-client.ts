import { maskEmail } from "../lib/mask";
import { ApiError, MIN_SEARCH_LENGTH, type ApiClient } from "./client";
import type {
  AdminDTO,
  AdminLoginResponse,
  AdminUserDTO,
  AudiencePreview,
  AudienceSegment,
  CampaignDTO,
  CampaignInput,
  Page,
  Platform,
  Tier,
  UUID,
} from "./types";

/** 모의 이용자 한 명 — 계약 DTO에 더해 대상 조건을 판정할 속성을 갖는다. */
interface MockUser {
  id: UUID;
  name: string;
  email: string | null;
  provider: "apple" | "google";
  createdAt: string;
  platform: Platform;
  tier: Tier;
  crew: "leader" | "member" | "none";
  lastRunDaysAgo: number | null;
  locale: "ko" | "en";
  devices: number;
}

const NAMES = [
  "김지훈",
  "이서연",
  "박민준",
  "최지우",
  "정하준",
  "강서윤",
  "조도윤",
  "윤하은",
  "장시우",
  "임지민",
  "한예준",
  "오수아",
  "서주원",
  "신지아",
  "권건우",
  "황채원",
  "안우진",
  "송다은",
  "류현우",
  "홍유나",
  "전지호",
  "고서현",
  "문준서",
  "양소율",
  "손지환",
  "배하린",
  "백은우",
  "허윤서",
  "유승현",
  "노지윤",
  "Daniel Kim",
  "Emma Park",
  "Liam Choi",
  "Olivia Lee",
  "Noah Jung",
  "Ava Han",
  "김지훈",
  "이지은",
  "박지성",
  "최지원",
];

const ROMAN = [
  "jihoon",
  "seoyeon",
  "minjun",
  "jiwoo",
  "hajun",
  "seoyun",
  "doyun",
  "haeun",
  "siwoo",
  "jimin",
  "yejun",
  "sua",
  "juwon",
  "jia",
  "gunwoo",
  "chaewon",
  "woojin",
  "daeun",
  "hyunwoo",
  "yuna",
  "jiho",
  "seohyun",
  "junseo",
  "soyul",
  "jihwan",
  "harin",
  "eunwoo",
  "yunseo",
  "seunghyun",
  "jiyun",
  "daniel",
  "emma",
  "liam",
  "olivia",
  "noah",
  "ava",
  "jihoon.k",
  "jieun",
  "jisung",
  "jiwon",
];

function uuid(n: number): UUID {
  const hex = n.toString(16).padStart(12, "0");
  return `5c0e2a4e-0000-4000-8000-${hex}`;
}

function seedUsers(): MockUser[] {
  const tiers: Tier[] = ["free", "free", "free", "plus", "crew"];
  const crews: MockUser["crew"][] = ["none", "none", "member", "member", "leader"];
  return NAMES.map((name, i) => ({
    id: uuid(i + 1),
    name,
    email: i % 7 === 6 ? null : `${ROMAN[i]}@${i % 3 === 0 ? "icloud.com" : "gmail.com"}`,
    provider: i % 2 === 0 ? "apple" : "google",
    createdAt: new Date(Date.UTC(2026, 6, 20 + (i % 70))).toISOString(),
    platform: i % 4 === 3 ? "android" : "ios",
    tier: tiers[i % tiers.length],
    crew: crews[i % crews.length],
    lastRunDaysAgo: i % 6 === 5 ? null : (i * 3) % 40,
    locale: i >= 30 && i < 36 ? "en" : "ko",
    devices: i % 5 === 0 ? 2 : 1,
  }));
}

function toDTO(user: MockUser): AdminUserDTO {
  return {
    id: user.id,
    name: user.name,
    emailMasked: user.email ? maskEmail(user.email) : null,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

function matches(user: MockUser, segment: AudienceSegment): boolean {
  if (segment.userIds && !segment.userIds.includes(user.id)) return false;
  if (segment.platform && segment.platform !== user.platform) return false;
  if (segment.tiers?.length && !segment.tiers.includes(user.tier)) return false;
  if (segment.crew === "member" && user.crew === "none") return false;
  if (segment.crew === "none" && user.crew !== "none") return false;
  if (segment.crew === "leader" && user.crew !== "leader") return false;
  if (segment.signedUpFrom && user.createdAt < segment.signedUpFrom) return false;
  if (segment.signedUpTo && user.createdAt > segment.signedUpTo) return false;
  if (segment.locale && segment.locale !== user.locale) return false;
  if (segment.lastRun) {
    const days = user.lastRunDaysAgo;
    if ("withinDays" in segment.lastRun) {
      if (days === null || days > segment.lastRun.withinDays) return false;
    } else if (days !== null && days <= segment.lastRun.noneWithinDays) {
      return false;
    }
  }
  return true;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("aborted", "AbortError"));
    });
  });
}

export interface MockApiClientOptions {
  /** 응답 지연(ms). 테스트는 0. */
  latency?: number;
  now?: () => Date;
}

/**
 * 계약 §21을 흉내 내는 메모리 구현 — 서버의 운영자 API가 붙기 전에 화면을 만들고 검증한다.
 * 규칙(상태 전이 · 검색 · 대상 판정)은 계약 문구를 따른다.
 */
export class MockApiClient implements ApiClient {
  private readonly users = seedUsers();
  private readonly campaigns: CampaignDTO[] = [];
  private testRecipientIds: UUID[] = [];
  private readonly latency: number;
  private readonly now: () => Date;
  private nextCampaign = 1;

  constructor(options: MockApiClientOptions = {}) {
    this.latency = options.latency ?? 280;
    this.now = options.now ?? (() => new Date());
    this.seedCampaigns();
  }

  private admin: AdminDTO = { email: "ops@syncrunlabs.com", name: "운영자" };

  private seedCampaigns() {
    const base: Omit<CampaignDTO, "id" | "createdAt" | "status" | "counts" | "titleKo" | "bodyKo"> = {
      type: "notice",
      titleEn: "Notice",
      bodyEn: "Please check the notice.",
      destination: "notices",
      segment: {},
      scheduledAt: null,
      startedAt: null,
      finishedAt: null,
      createdBy: "ops@syncrunlabs.com",
    };
    this.campaigns.push(
      {
        ...base,
        id: uuid(9001),
        titleKo: "10월 20일 새벽 점검",
        bodyKo: "02:00~04:00 사이 함께 뛰기가 잠시 멈춰요.",
        status: "sent",
        createdAt: "2026-10-10T09:00:00Z",
        startedAt: "2026-10-10T09:00:30Z",
        finishedAt: "2026-10-10T09:01:10Z",
        counts: { target: 1240, sent: 1228, failed: 12, opened: 318 },
      },
      {
        ...base,
        id: uuid(9002),
        titleKo: "크루가 열렸어요",
        bodyKo: "함께 뛴 사람들과 크루를 만들어 보세요.",
        destination: "crew",
        status: "scheduled",
        createdAt: "2026-10-12T02:00:00Z",
        scheduledAt: "2026-10-20T01:00:00Z",
        counts: { target: 0, sent: 0, failed: 0, opened: 0 },
      },
    );
  }

  private async delay(signal?: AbortSignal) {
    if (this.latency > 0) await wait(this.latency, signal);
  }

  private find(id: UUID): CampaignDTO {
    const campaign = this.campaigns.find((c) => c.id === id);
    if (!campaign) throw new ApiError("NOT_FOUND", 404, "campaign not found");
    return campaign;
  }

  private count(segment: AudienceSegment): AudiencePreview {
    const picked = this.users.filter((user) => matches(user, segment));
    const devices = { ios: 0, android: 0 };
    for (const user of picked) devices[user.platform] += user.devices;
    return { users: picked.length, devices };
  }

  async login(idToken: string): Promise<AdminLoginResponse> {
    await this.delay();
    if (!idToken) throw new ApiError("UNAUTHORIZED", 401, "empty token");
    return {
      token: `mock.${idToken}`,
      expiresAt: new Date(this.now().getTime() + 60 * 60 * 1000).toISOString(),
      admin: this.admin,
    };
  }

  async me(): Promise<AdminDTO> {
    await this.delay();
    return this.admin;
  }

  async searchUsers(q: string, signal?: AbortSignal): Promise<AdminUserDTO[]> {
    await this.delay(signal);
    const query = q.trim().toLowerCase();
    if (query.length < MIN_SEARCH_LENGTH) {
      throw new ApiError("VALIDATION_FAILED", 400, "q must be at least 2 characters");
    }
    return this.users
      .filter(
        (user) =>
          user.id === query ||
          user.name.toLowerCase().includes(query) ||
          (user.email?.toLowerCase().startsWith(query) ?? false),
      )
      .slice(0, 8)
      .map(toDTO);
  }

  async getUser(id: UUID): Promise<AdminUserDTO | null> {
    await this.delay();
    const user = this.users.find((u) => u.id === id);
    return user ? toDTO(user) : null;
  }

  async previewAudience(segment: AudienceSegment, signal?: AbortSignal): Promise<AudiencePreview> {
    await this.delay(signal);
    return this.count(segment);
  }

  async listCampaigns(): Promise<Page<CampaignDTO>> {
    await this.delay();
    const items = [...this.campaigns].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { items: items.map((c) => structuredClone(c)), nextCursor: null };
  }

  async createCampaign(input: CampaignInput): Promise<CampaignDTO> {
    await this.delay();
    const campaign: CampaignDTO = {
      ...structuredClone(input),
      id: uuid(10000 + this.nextCampaign++),
      status: "draft",
      scheduledAt: null,
      startedAt: null,
      finishedAt: null,
      createdBy: this.admin.email,
      createdAt: this.now().toISOString(),
      counts: { target: 0, sent: 0, failed: 0, opened: 0 },
    };
    this.campaigns.push(campaign);
    return structuredClone(campaign);
  }

  async getCampaign(id: UUID): Promise<CampaignDTO> {
    await this.delay();
    return structuredClone(this.find(id));
  }

  async updateCampaign(id: UUID, patch: Partial<CampaignInput>): Promise<CampaignDTO> {
    await this.delay();
    const campaign = this.find(id);
    if (campaign.status !== "draft") throw new ApiError("CONFLICT", 409, "not a draft");
    Object.assign(campaign, structuredClone(patch));
    return structuredClone(campaign);
  }

  async sendTest(id: UUID): Promise<{ sent: number }> {
    await this.delay();
    this.find(id);
    return { sent: this.testRecipientIds.length };
  }

  async schedule(id: UUID, scheduledAt?: string): Promise<CampaignDTO> {
    await this.delay();
    const campaign = this.find(id);
    if (campaign.status !== "draft") throw new ApiError("CONFLICT", 409, "not a draft");
    const at = scheduledAt ? new Date(scheduledAt) : this.now();
    if (scheduledAt && at.getTime() < this.now().getTime()) {
      throw new ApiError("VALIDATION_FAILED", 400, "scheduledAt is in the past");
    }
    if (this.count(campaign.segment).users === 0) {
      throw new ApiError("EMPTY_AUDIENCE", 400, "no recipients");
    }
    campaign.status = "scheduled";
    campaign.scheduledAt = at.toISOString();
    if (!scheduledAt) this.dispatch(campaign);
    return structuredClone(campaign);
  }

  /** 즉시 발송을 흉내 낸다 — 잠시 `sending` 이었다가 `sent`. */
  private dispatch(campaign: CampaignDTO) {
    const preview = this.count(campaign.segment);
    const target = preview.devices.ios + preview.devices.android;
    campaign.status = "sending";
    campaign.startedAt = this.now().toISOString();
    campaign.counts.target = target;
    setTimeout(() => {
      if (campaign.status !== "sending") return;
      const failed = Math.floor(target * 0.01);
      campaign.status = "sent";
      campaign.finishedAt = new Date().toISOString();
      campaign.counts = { target, sent: target - failed, failed, opened: Math.floor(target * 0.2) };
    }, 4000);
  }

  async cancel(id: UUID): Promise<CampaignDTO> {
    await this.delay();
    const campaign = this.find(id);
    if (campaign.status !== "scheduled" && campaign.status !== "sending") {
      throw new ApiError("CONFLICT", 409, "cannot cancel");
    }
    campaign.status = "canceled";
    campaign.finishedAt = this.now().toISOString();
    return structuredClone(campaign);
  }

  async getTestRecipients(): Promise<AdminUserDTO[]> {
    await this.delay();
    return this.users.filter((u) => this.testRecipientIds.includes(u.id)).map(toDTO);
  }

  async setTestRecipients(userIds: UUID[]): Promise<AdminUserDTO[]> {
    await this.delay();
    if (userIds.length > 5) throw new ApiError("VALIDATION_FAILED", 400, "at most 5");
    this.testRecipientIds = [...new Set(userIds)];
    return this.getTestRecipients();
  }
}
