/* 랜딩의 메타(제목·설명)와 푸터 문구, 한국어/영어. 랜딩 본문은 product.ts에 있다.
   구조: dict[lang].<절>.<키>. 푸터는 useLang()의 t로 읽는다. */

import { supportMailto } from "../lib/contact";

export type Lang = "ko" | "en";

export interface Dict {
  meta: { title: string; description: string };
  footer: {
    tagline: string;
    cols: { head: string; links: { label: string; href: string }[] }[];
    /* 사업자 정보 — 값은 lib/company.ts에서 오고 여기엔 라벨만 둔다. */
    bizHead: string;
    bizLabels: { ceo: string; bizNo: string };
    rights: string;
  };
}

/* 지원/약관/회사는 언어별 경로다. Footer가 useLang().base를 앞에 붙인다. */
const SUPPORT = "support";
const LEGAL = "legal";
const COMPANY_PAGE = "company";
const ACCOUNT_DELETE = "account/delete";

export const dict: Record<Lang, Dict> = {
  ko: {
    meta: {
      title: "SyncRun · 폰을 맞대면 바로 함께 뛰는 러닝 앱",
      description:
        "옆 사람과 폰을 맞대면 그 자리에서 함께 뛰는 러닝 앱. 혼자 뛰는 날도 같은 버튼으로 시작하고, 끝나면 함께 달린 경로가 카드 한 장으로 남아요.",
    },
    footer: {
      tagline: "달린 길은 선이 되고,\n같이 달린 길은 겹친다.",
      cols: [
        {
          head: "제품",
          links: [
            { label: "함께 뛰기", href: "#together" },
            { label: "혼자 뛰기", href: "#solo" },
            { label: "크루", href: "#crew" },
            { label: "러닝 카드", href: "#card" },
            { label: "플랜", href: "#plans" },
          ],
        },
        {
          head: "지원",
          links: [
            { label: "회사 소개", href: `${COMPANY_PAGE}` },
            { label: "지원 · 도움말", href: `${SUPPORT}` },
            { label: "권한 안내", href: `${SUPPORT}#permissions` },
            { label: "계정 삭제 안내", href: `${ACCOUNT_DELETE}` },
            { label: "문의", href: supportMailto("[SyncRun 문의]") },
          ],
        },
        {
          head: "약관",
          links: [
            { label: "이용약관", href: `${LEGAL}/terms-of-service` },
            { label: "개인정보 처리방침", href: `${LEGAL}/privacy-policy` },
            { label: "위치기반서비스", href: `${LEGAL}/location-terms` },
          ],
        },
      ],
      bizHead: "사업자 정보",
      bizLabels: { ceo: "대표", bizNo: "사업자등록번호" },
      rights: "© 2026 SyncRun Labs",
    },
  },

  en: {
    meta: {
      title: "SyncRun · Bring your phones together and run as a group",
      description:
        "Run alone and it's one line. Bring your phones together and it's several. SyncRun measures with GPS and your steps, and turns the lines you ran together into one card.",
    },
    footer: {
      tagline: "Every run leaves a line.\nRun together, and they overlap.",
      cols: [
        {
          head: "Product",
          links: [
            { label: "Run together", href: "#together" },
            { label: "Run solo", href: "#solo" },
            { label: "Crew", href: "#crew" },
            { label: "Run cards", href: "#card" },
            { label: "Plans", href: "#plans" },
          ],
        },
        {
          head: "Support",
          links: [
            { label: "About us", href: `${COMPANY_PAGE}` },
            { label: "Support · Help", href: `${SUPPORT}` },
            { label: "Permissions", href: `${SUPPORT}#permissions` },
            { label: "Delete your account", href: `${ACCOUNT_DELETE}` },
            { label: "Contact", href: supportMailto("[SyncRun]") },
          ],
        },
        {
          head: "Legal",
          links: [
            { label: "Terms of Service", href: `${LEGAL}/terms-of-service` },
            { label: "Privacy Policy", href: `${LEGAL}/privacy-policy` },
            { label: "Location Services", href: `${LEGAL}/location-terms` },
          ],
        },
      ],
      bizHead: "Business information",
      bizLabels: { ceo: "Representative", bizNo: "Business registration no." },
      rights: "© 2026 SyncRun Labs",
    },
  },
};
