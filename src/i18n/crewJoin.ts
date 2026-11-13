/* 크루 초대 링크 페이지 카피 · 한국어/영어. 흐름의 사실관계는 허브 requirements FR-CREW-08과
   api-contract §18.12를 따른다. 메신저 안의 브라우저에서도 앱으로 넘어가게 [SyncRun에서 열기]가 앱 주소로 간다. */

import type { Lang } from "./dict";
import type { PageMeta } from "./lang";

export interface CrewJoinCopy {
  meta: PageMeta;
  /** 초대 카드 위의 작은 머리말(앱의 「크루 초대」 칸과 같은 말) */
  label: string;
  invitedBy: (inviter: string) => string;
  members: (count: number) => string;
  fallbackTitle: string;
  lede: string;
  open: string;
  install: { heading: string; steps: string[]; store: string };
  android: { heading: string; lede: string };
  desktop: { heading: string; lede: string; store: string };
  about: { heading: string; facts: { k: string; v: string }[]; more: string };
  expired: { title: string; lede: string };
  other: string;
}

export const crewJoinCopy: Record<Lang, CrewJoinCopy> = {
  ko: {
    meta: {
      title: "SyncRun 크루 초대",
      description: "크루에 초대받았어요. SyncRun에서 열어 가입을 요청하세요.",
    },
    label: "크루 초대",
    invitedBy: (inviter) => `${inviter}님이 초대했어요`,
    members: (count) => `크루원 ${count}명`,
    fallbackTitle: "크루에 초대받았어요",
    lede: "SyncRun에서 열어 가입을 요청하면, 크루장이 승인한 뒤 크루원이 돼요. 크루원이 되는 데 구독은 필요 없어요.",
    open: "SyncRun에서 열기",
    install: {
      heading: "아직 SyncRun이 없나요?",
      steps: ["App Store에서 SyncRun을 받아요.", "로그인한 뒤, 받은 링크를 다시 눌러요."],
      store: "App Store에서 받기",
    },
    android: {
      heading: "Android 앱은 준비 중이에요",
      lede: "지금은 iPhone에서 크루에 가입할 수 있어요.",
    },
    desktop: {
      heading: "iPhone에서 이 링크를 열어 주세요",
      lede: "크루 가입은 앱에서 해요. 받은 메시지를 iPhone에서 열고 링크를 누르면 바로 이어져요.",
      store: "App Store에서 보기",
    },
    about: {
      heading: "크루와 함께 뛰면",
      facts: [
        { k: "출석은 자동으로", v: "크루원끼리 폰을 맞대고 뛰면 출석이 기록돼요. 따로 출석을 부를 필요가 없어요." },
        { k: "정기런 알림은 앱이 대신", v: "전날 저녁과 시작 10분 전에 크루원 모두에게 알림이 가요." },
        { k: "함께 쌓은 기록은 리캡으로", v: "한 달, 한 해 합산 거리와 세션 수, 출석왕을 함께 봐요." },
      ],
      more: "SyncRun 알아보기",
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
    label: "Crew invitation",
    invitedBy: (inviter) => `Invited by ${inviter}`,
    members: (count) => `${count} ${count === 1 ? "member" : "members"}`,
    fallbackTitle: "You've been invited to a crew",
    lede: "Open it in SyncRun and ask to join. You'll become a member once the crew leader approves. You don't need a subscription to be a member.",
    open: "Open in SyncRun",
    install: {
      heading: "Don't have SyncRun yet?",
      steps: ["Get SyncRun from the App Store.", "Sign in, then tap the link you received again."],
      store: "Download on the App Store",
    },
    android: {
      heading: "The Android app is on its way",
      lede: "For now, you can join a crew on iPhone.",
    },
    desktop: {
      heading: "Open this link on your iPhone",
      lede: "You join a crew in the app. Open the message on your iPhone and tap the link to continue.",
      store: "View on the App Store",
    },
    about: {
      heading: "Running with a crew",
      facts: [
        { k: "Attendance takes care of itself", v: "When members gather their phones and run, attendance is recorded." },
        { k: "Reminders for regular runs", v: "Everyone gets a notification the evening before and 10 minutes before the start." },
        { k: "Recaps of what you built", v: "See monthly and yearly totals, sessions, and the top attendee together." },
      ],
      more: "Learn about SyncRun",
    },
    expired: {
      title: "This invite link has ended",
      lede: "Invite links end 14 days after they're created, or when the crew leader creates a new one. Ask the crew leader for a new link.",
    },
    other: "한국어",
  },
};
