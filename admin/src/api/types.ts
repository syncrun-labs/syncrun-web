/** 운영자 API DTO — syncrun contracts/api-contract.md §21.2 그대로. */

export type ISODate = string;
export type UUID = string;

export interface AdminDTO {
  email: string;
  name: string;
}

export interface AdminLoginResponse {
  token: string;
  expiresAt: ISODate;
  admin: AdminDTO;
}

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "canceled";
export type PushDestination = "home" | "notices" | "crew" | "url";
export type Tier = "free" | "plus" | "crew";
export type Platform = "ios" | "android";
export type Locale = "ko" | "en";

export type LastRun = { withinDays: number } | { noneWithinDays: number };

/** 필드는 AND. 빈 객체는 전체. */
export interface AudienceSegment {
  userIds?: UUID[];
  platform?: Platform;
  tiers?: Tier[];
  crew?: "member" | "none" | "leader";
  signedUpFrom?: ISODate;
  signedUpTo?: ISODate;
  lastRun?: LastRun;
  locale?: Locale;
}

export interface CampaignInput {
  type: "notice";
  titleKo: string;
  bodyKo: string;
  titleEn: string;
  bodyEn: string;
  destination: PushDestination;
  url?: string;
  segment: AudienceSegment;
}

export interface CampaignCounts {
  target: number;
  sent: number;
  failed: number;
  opened: number;
}

export interface CampaignDTO extends CampaignInput {
  id: UUID;
  status: CampaignStatus;
  scheduledAt: ISODate | null;
  startedAt: ISODate | null;
  finishedAt: ISODate | null;
  createdBy: string;
  createdAt: ISODate;
  counts: CampaignCounts;
}

export interface AudiencePreview {
  users: number;
  devices: { ios: number; android: number };
}

export interface AdminUserDTO {
  id: UUID;
  name: string;
  emailMasked: string | null;
  provider: "apple" | "google" | "dev";
  createdAt: ISODate;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
