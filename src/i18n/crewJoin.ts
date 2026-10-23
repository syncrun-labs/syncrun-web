/* 크루 초대 링크 페이지 카피 — 한국어/영어. 흐름의 사실관계는 허브 requirements FR-CREW-08과
   api-contract §18.12를 따른다. 메신저 안의 브라우저에서도 앱으로 넘어가게 [SyncRun에서 열기]가 앱 주소로 간다. */

import type { Lang } from "./dict";
import type { PageMeta } from "./lang";

export interface CrewJoinCopy {
  meta: PageMeta;
  invitedBy: (inviter: string, members: number) => string;
  fallbackTitle: string;
  lede: string;
  open: string;
  install: { heading: string; steps: string[]; store: string };
  expired: { title: string; lede: string };
  other: string;
}

export const crewJoinCopy: Record<Lang, CrewJoinCopy> = {
  ko: {
    meta: {
      title: "SyncRun 크루 초대",
      description: "크루에 초대받았어요. SyncRun에서 열어 가입을 요청하세요.",
    },
    invitedBy: (inviter, members) => `${inviter}님이 초대했어요 · 크루원 ${members}명`,
    fallbackTitle: "크루에 초대받았어요",
    lede: "SyncRun에서 열어 가입을 요청하면, 크루장이 승인한 뒤 크루원이 돼요. 크루원이 되는 데 구독은 필요 없어요.",
    open: "SyncRun에서 열기",
    install: {
      heading: "아직 SyncRun이 없나요?",
      steps: ["App Store에서 SyncRun을 받아요.", "로그인한 뒤, 받은 링크를 다시 눌러요."],
      store: "App Store에서 받기",
    },
    expired: {
      title: "끝난 초대 링크예요",
      lede: "초대 링크는 만든 지 14일이 지나거나 크루장이 새로 만들면 끝나요. 크루장에게 새 링크를 받아 주세요.",
    },
    other: "English",
  },
  en: {
    meta: {
      title: "SyncRun crew invitation",
      description: "You've been invited to a crew. Open it in SyncRun to ask to join.",
    },
    invitedBy: (inviter, members) =>
      `Invited by ${inviter} · Members: ${members}`,
    fallbackTitle: "You've been invited to a crew",
    lede: "Open it in SyncRun and ask to join — you'll become a member once the crew leader approves. You don't need a subscription to be a member.",
    open: "Open in SyncRun",
    install: {
      heading: "Don't have SyncRun yet?",
      steps: ["Get SyncRun from the App Store.", "Sign in, then tap the link you received again."],
      store: "Download on the App Store",
    },
    expired: {
      title: "This invite link has ended",
      lede: "Invite links end 14 days after they're created, or when the crew leader creates a new one. Ask the crew leader for a new link.",
    },
    other: "한국어",
  },
};
