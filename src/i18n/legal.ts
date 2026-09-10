/* 약관 페이지의 골격 카피 — 한국어/영어. **문서 본문은 번역하지 않는다.**
   약관 3종은 한국어가 정본이고 앱이 동의를 받는 것도 그 문서다. 영어로 오는 이용자를 위해
   페이지 골격과 "정본은 한국어"라는 안내만 영어로 둔다. */

import type { Lang } from "./dict";
import type { PageMeta } from "./lang";

export interface LegalCopy {
  meta: PageMeta;
  nav: { home: string; support: string };
  head: { title: string; lede: string };
  tabsLabel: string;
  tabs: { terms: string; privacy: string; location: string };
  /** 한국어로 읽는 이용자에겐 필요 없는 안내라 ko는 null이다. */
  notice: {
    paragraphs: string[];
    askPrefix: string;
    askMiddle: string;
    askLink: string;
    askSuffix: string;
  } | null;
  foot: { home: string; company: string; support: string; contact: string };
}

export const legalCopy: Record<Lang, LegalCopy> = {
  ko: {
    meta: {
      title: "SyncRun 약관 및 정책 — 이용약관 · 개인정보 · 위치기반",
      description: "SyncRun 서비스 이용약관, 개인정보 처리방침, 위치기반서비스 이용약관 전문.",
    },
    nav: { home: "홈", support: "지원" },
    head: {
      title: "약관 및 정책",
      lede: "싱크런(SyncRun)의 이용약관과 개인정보·위치정보 처리 방침 전문입니다. 앱 첫 실행의 동의 화면과 ‘나’ 탭에서도 같은 내용을 볼 수 있습니다.",
    },
    tabsLabel: "약관 문서",
    tabs: { terms: "이용약관", privacy: "개인정보 처리방침", location: "위치기반서비스" },
    notice: null,
    foot: { home: "홈", company: "회사 소개", support: "지원", contact: "문의" },
  },

  en: {
    meta: {
      title: "SyncRun Terms & Policies",
      description:
        "SyncRun terms of service, privacy policy and location-based service terms. Published in Korean, which is the governing version.",
    },
    nav: { home: "Home", support: "Support" },
    head: {
      title: "Terms & policies",
      lede: "The full terms of service and the privacy and location-data policies for SyncRun. The same documents appear on the consent screen at first launch and under the Me tab in the app.",
    },
    tabsLabel: "Legal documents",
    tabs: {
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      location: "Location-Based Services",
    },
    notice: {
      paragraphs: [
        "These documents are published in Korean. The Korean text is the governing version and the one the app asks you to agree to.",
        "In short: location is collected to measure your runs and is shared live only with the runners in your session; heart rate is collected only with separate consent; runs are stored on your device first and synced to your account; and you can delete your account and every run at any time from Me > Account > Delete account.",
      ],
      askPrefix: "If you need any part of these documents explained in English, email ",
      askMiddle: ". Business and contact information in English is on the ",
      askLink: "About page",
      askSuffix: ".",
    },
    foot: { home: "Home", company: "About", support: "Support", contact: "Contact" },
  },
};
