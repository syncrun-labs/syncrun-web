/* 랜딩 카피 — 한국어/영어. 제품 메시지는 syncrun 허브의 현재 사실을 따른다.
   구조: dict[lang].<섹션>.<키>. 컴포넌트는 useLang()의 t로 접근한다. */

import { supportMailto } from "../lib/contact";

export type Lang = "ko" | "en";

/** 번호 목록의 한 줄 — 제목과 한 문장. */
export interface Fact {
  k: string;
  v: string;
}

export interface Dict {
  meta: { title: string; description: string };
  nav: { bump: string; oneStart: string; card: string; features: string; cta: string };
  hero: {
    titleTop: string;
    titleAccent: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  bump: {
    titleTop: string;
    titleAccent: string;
    lede: string;
    /** 두 폰 위 인원 숫자의 설명 라벨. */
    countLabel: string;
    /** 맞댐 장면의 대체 텍스트. */
    alt: string;
    facts: Fact[];
  };
  oneStart: {
    titleLead: string;
    titleAccent: string;
    facts: Fact[];
    solo: string;
    together: string;
    /* 버튼 라벨은 앱의 Start 버튼과 같다 — 혼자면 [시작], 결성되면 [준비]. */
    soloBtn: string;
    togetherBtn: string;
    bump: string;
  };
  live: { title: string; lede: string; facts: Fact[] };
  card: { titleLead: string; titleAccent: string; titleTail: string; lede: string; facts: Fact[] };
  activity: { title: string; lede: string; facts: Fact[] };
  features: {
    title: string;
    lede: string;
    items: { title: string; body: string; runner: number }[];
  };
  cta: { titleTop: string; titleAccent: string; lede: string; ctaPrimary: string; ctaSecondary: string };
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

export const dict: Record<Lang, Dict> = {
  ko: {
    meta: {
      title: "SyncRun — 맞대면, 그 자리에서 함께 뛴다",
      description:
        "옆 사람과 iPhone을 가까이 대면 그 자리에서 함께 뛸 그룹이 만들어지고, 함께 뛴 기록이 한 장의 러닝 카드가 됩니다. 솔로와 그룹은 하나의 Start.",
    },
    nav: { bump: "맞댐", oneStart: "하나의 Start", card: "러닝 카드", features: "기능", cta: "App Store" },
    hero: {
      titleTop: "맞대면, 그 자리에서",
      titleAccent: "함께 뛴다",
      lede:
        "옆 사람과 iPhone을 가까이 대면 그 자리에서 함께 뛸 그룹이 만들어집니다. 방도, 초대 링크도 없이 — 함께 뛴 기록은 한 장의 러닝 카드로 남습니다.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "어떻게 뛰나요",
      scroll: "아래로",
    },
    bump: {
      titleTop: "가까이 대면,",
      titleAccent: "그 자리에서 결성",
      lede:
        "함께 뛸 사람과 iPhone을 가까이 대세요. 가까이 댄 사람만 우리가 되고, 인원이 하나씩 올라갑니다. 흔들거나 부딪칠 필요는 없습니다.",
      countLabel: "함께 뛸 사람",
      alt: "두 iPhone이 가까워지면 함께 뛸 사람이 1에서 2가 된다",
      facts: [
        {
          k: "가까이 댄 사람만",
          v: "200명이 뛰는 한강에서도 옆에서 폰을 댄 사람만 합류합니다. 모르는 러너가 섞이지 않습니다.",
        },
        {
          k: "2명부터 30명까지",
          v: "이미 결성된 그룹에 한 명이 더 대면 그대로 합류하고, 두 그룹이 대면 하나로 합쳐집니다.",
        },
        {
          k: "안 되면 합류 요청",
          v: "UWB가 없는 기기거나 결성이 안 되면 8초 뒤 합류 요청이 열립니다. 상대가 수락해야 들어옵니다.",
        },
      ],
    },
    oneStart: {
      titleLead: "솔로와 그룹은 모드가 아니라",
      titleAccent: "상태다",
      facts: [
        { k: "버튼은 하나", v: "그냥 누르면 혼자, 옆 사람과 대면 함께. 같은 자리의 같은 버튼이 이름과 인원만 바꿉니다." },
        { k: "3·2·1, 같은 순간에", v: "모두가 준비를 누르면 마지막 사람의 버튼이 시작으로 바뀌고, 전원이 같은 순간에 출발합니다." },
        { k: "기록은 항상 저장 중", v: "어떤 경우에도 잃지 않습니다. 그룹이 한 명이 되면 그대로 혼자 이어 뜁니다." },
      ],
      solo: "혼자",
      together: "함께",
      soloBtn: "시작",
      togetherBtn: "준비",
      bump: "맞댐",
    },
    live: {
      title: "달리는 동안, 서로가 보인다",
      lede:
        "함께 뛰는 사람들의 위치와 페이스가 같은 순간 흐릅니다. 거리·페이스·고도·케이던스는 추정 없이 실제로 측정합니다.",
      facts: [
        { k: "실시간 위치·페이스", v: "서로의 위치가 지도 위에서 함께 흐르고, 그룹 거리와 평균 페이스가 위에 고정됩니다." },
        { k: "끊겨도 이어달리기", v: "연결이 끊기면 다시 붙여 세션과 기록을 그대로 복원합니다." },
        { k: "하이파이브", v: "달리다 동료를 탭하면 상대의 손목에 진동으로 전해집니다." },
      ],
    },
    card: {
      titleLead: "함께 뛴 경로가",
      titleAccent: "한\u00a0장의 작품",
      titleTail: "이 된다",
      lede: "러닝이 끝나는 순간 카드는 이미 완성돼 있습니다. 개인용·단체용을 따로 만들지 않고 한 장만 남깁니다.",
      facts: [
        { k: "배경은 셋 중 하나", v: "시그니처 색, 내 사진, 지도. 사진은 내 기기에만 남고 다른 사람에게는 시그니처로 보입니다." },
        { k: "내 경로만, 또는 전원의 경로", v: "함께 뛴 사람마다 다른 색으로 겹쳐 그립니다." },
        { k: "간단하게, 자세하게", v: "거리·시간·페이스만, 또는 심박·케이던스·고도까지." },
      ],
    },
    activity: {
      title: "모든 러닝이 이야기가 된다",
      lede:
        "지금까지 이어 온 거리, 함께 만든 러닝, 평균 페이스와 심박까지 — 한 화면의 이야기로 모입니다. 솔로와 함께를 나눠 돌아보고, 각 기록은 다시 한 장의 카드로 열립니다.",
      facts: [
        { k: "총 이야기", v: "지금까지 이어 온 모든 러닝의 합" },
        { k: "함께 만든 이야기", v: "가까이 대어 함께 뛴 거리만 따로" },
        { k: "실측 지표", v: "평균 페이스·심박까지 측정값 그대로" },
      ],
    },
    features: {
      title: "러닝에 필요한 모든 것",
      lede: "함께 뛰는 순간 밖에서도, 러닝을 이어 가는 데 필요한 것들.",
      items: [
        { title: "실측 러닝 지표", body: "GPS와 걸음을 함께 읽어 거리·페이스·고도·케이던스를 추정 없이 실제로 측정합니다.", runner: 0 },
        { title: "Apple Watch", body: "손목에서 시작하고 심박을 함께 기록합니다.", runner: 5 },
        { title: "라이브 액티비티 · 위젯", body: "잠금 화면과 다이내믹 아일랜드에서 러닝 현황을 확인합니다.", runner: 3 },
        { title: "건강 앱 연동", body: "완료한 러닝을 건강 앱으로 내보냅니다.", runner: 7 },
        { title: "음성 코치", body: "페이스와 구간을 목소리로 짚어 줍니다.", runner: 1 },
        { title: "경로 리플레이", body: "달린 길을 다시 재생하며 그날의 러닝을 돌아봅니다.", runner: 2 },
      ],
    },
    cta: {
      titleTop: "다음 러닝은,",
      titleAccent: "함께.",
      lede: "옆 사람과 폰을 가까이 대는 순간, 오늘의 러닝이 함께가 됩니다.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "도움이 필요하면",
    },
    footer: {
      tagline: "맞대면 그 자리에서\n함께 뛰는 러닝 앱.",
      cols: [
        {
          head: "제품",
          links: [
            { label: "맞댐", href: "#bump" },
            { label: "하나의 Start", href: "#onestart" },
            { label: "러닝 카드", href: "#card" },
            { label: "기능", href: "#features" },
          ],
        },
        {
          head: "지원",
          links: [
            { label: "회사 소개", href: `${COMPANY_PAGE}` },
            { label: "지원 · 도움말", href: `${SUPPORT}` },
            { label: "권한 안내", href: `${SUPPORT}#permissions` },
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
        {
          head: "개발",
          links: [
            { label: "GitHub", href: "https://github.com/syncrun-labs" },
            { label: "iOS 앱", href: "https://github.com/syncrun-labs/syncrun-ios" },
            { label: "백엔드", href: "https://github.com/syncrun-labs/syncrun-server" },
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
      title: "SyncRun — Bump. And you’re running together.",
      description:
        "Hold your iPhone near the person beside you and a running group forms on the spot. Every shared run becomes one running card. Solo and group share one Start.",
    },
    nav: { bump: "Bump", oneStart: "One Start", card: "Run Card", features: "Features", cta: "App Store" },
    hero: {
      titleTop: "Bump. And you’re",
      titleAccent: "running together.",
      lede:
        "Hold your iPhone near the person next to you and a running group forms in that instant. No rooms, no invite links — and the run you share stays as one running card.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "How it works",
      scroll: "Scroll",
    },
    bump: {
      titleTop: "Hold phones close,",
      titleAccent: "form on the spot",
      lede:
        "Hold your iPhone near your running partner’s. Only the people you bring close become your group, and the headcount ticks up one at a time. No shaking, no tapping.",
      countLabel: "Running with you",
      alt: "Two iPhones move together and the headcount goes from 1 to 2",
      facts: [
        {
          k: "Only the people beside you",
          v: "Among two hundred runners on the riverside, only the one who held their phone next to yours joins. Strangers never slip in.",
        },
        {
          k: "From 2 up to 30",
          v: "Bring one more person close to a formed group and they join as is; bring two groups together and they merge into one.",
        },
        {
          k: "Join request as a fallback",
          v: "On a phone without UWB, or if forming fails, a join request opens after 8 seconds. The other person has to accept.",
        },
      ],
    },
    oneStart: {
      titleLead: "Solo and group aren’t modes.",
      titleAccent: "They’re states.",
      facts: [
        { k: "One button", v: "Tap it and you run solo; bring the person beside you close and you run together. The same button in the same place only changes its label and headcount." },
        { k: "3·2·1, the same instant", v: "Once everyone taps Ready, the last person’s button turns into Start and everyone leaves together." },
        { k: "Always being saved", v: "You never lose a run. If the group drops to one, you simply keep running solo." },
      ],
      solo: "Solo",
      together: "Together",
      soloBtn: "Start",
      togetherBtn: "Ready",
      bump: "bump",
    },
    live: {
      title: "While you run, you see each other",
      lede:
        "Everyone’s location and pace stream in the same moment. Distance, pace, elevation and cadence are measured for real — never estimated.",
      facts: [
        { k: "Live location and pace", v: "Everyone’s position flows on one map, with group distance and average pace pinned on top." },
        { k: "Reattach and continue", v: "Drop the connection and it restores the session and the record on reattach." },
        { k: "High five", v: "Tap a partner while you run and it lands as a buzz on their wrist." },
      ],
    },
    card: {
      titleLead: "The route you ran together",
      titleAccent: "becomes a piece of art",
      titleTail: "",
      lede: "By the time the run ends, the card is already made. One card — never separate personal and group versions.",
      facts: [
        { k: "One of three backdrops", v: "Signature color, your own photo, or the map. Photos stay on your phone; everyone else sees the signature." },
        { k: "Your route, or everyone’s", v: "Each runner’s route is drawn in their own color, layered together." },
        { k: "Simple or detailed", v: "Distance, time and pace — or heart rate, cadence and elevation on top." },
      ],
    },
    activity: {
      title: "Every run becomes a story",
      lede:
        "The distance you’ve carried this far, the runs you made together, average pace and heart rate — all gathered into one screen. Look back at solo and together separately, and open any record as a card again.",
      facts: [
        { k: "Total story", v: "The sum of every run you’ve carried so far" },
        { k: "Made together", v: "Only the distance you ran side by side" },
        { k: "Measured metrics", v: "Average pace and heart rate, exactly as measured" },
      ],
    },
    features: {
      title: "Everything a run needs",
      lede: "Beyond the moment you run together, everything you need to keep running.",
      items: [
        { title: "Measured run metrics", body: "GPS and step data read together for distance, pace, elevation and cadence — measured for real, never estimated.", runner: 0 },
        { title: "Apple Watch", body: "Start from your wrist and record heart rate alongside.", runner: 5 },
        { title: "Live Activity · Widgets", body: "Check your run from the Lock Screen and Dynamic Island.", runner: 3 },
        { title: "Health app", body: "Export finished runs to the Health app.", runner: 7 },
        { title: "Voice coach", body: "Pace and splits called out in your ear.", runner: 1 },
        { title: "Route replay", body: "Play the path back and revisit that day’s run.", runner: 2 },
      ],
    },
    cta: {
      titleTop: "Your next run,",
      titleAccent: "together.",
      lede: "The moment you hold your phone near the person beside you, today’s run becomes a shared one.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "Need a hand?",
    },
    footer: {
      tagline: "Bump, and run together\non the spot.",
      cols: [
        {
          head: "Product",
          links: [
            { label: "Bump", href: "#bump" },
            { label: "One Start", href: "#onestart" },
            { label: "Run Card", href: "#card" },
            { label: "Features", href: "#features" },
          ],
        },
        {
          head: "Support",
          links: [
            { label: "About us", href: `${COMPANY_PAGE}` },
            { label: "Support · Help", href: `${SUPPORT}` },
            { label: "Permissions", href: `${SUPPORT}#permissions` },
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
        {
          head: "Build",
          links: [
            { label: "GitHub", href: "https://github.com/syncrun-labs" },
            { label: "iOS app", href: "https://github.com/syncrun-labs/syncrun-ios" },
            { label: "Backend", href: "https://github.com/syncrun-labs/syncrun-server" },
          ],
        },
      ],
      bizHead: "Business information",
      bizLabels: { ceo: "Representative", bizNo: "Business registration no." },
      rights: "© 2026 SyncRun Labs",
    },
  },
};
