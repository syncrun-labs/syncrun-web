/* 랜딩 카피 — 한국어/영어. 제품 메시지는 syncrun 허브의 현재 사실을 따른다.
   구조: dict[lang].<섹션>.<키>. 컴포넌트는 useLang()의 t로 접근한다. */

import { supportMailto } from "../lib/contact";

export type Lang = "ko" | "en";

/** 번호 목록의 한 줄 — 제목과 한 문장. */
export interface Fact {
  k: string;
  v: string;
}

/** 히어로의 한 마디. 제목은 줄 단위 배열이다 — 한글 줄바꿈을 자동에 맡기지 않는다. */
export interface Beat {
  h: string[];
  /** 코랄로 낼 줄의 인덱스. 없으면 전부 흰색이다. */
  accent?: number;
  p: string;
}

export interface Dict {
  meta: { title: string; description: string };
  nav: { oneStart: string; bump: string; card: string; features: string; cta: string };
  hero: {
    beats: [Beat, Beat, Beat];
    ctaPrimary: string;
    ctaSecondary: string;
    /** 배경 시퀀스가 무엇을 보여주는지 — 장식이지만 설명은 남긴다. */
    backdropAlt: string;
  };
  oneStart: {
    title: string;
    lede: string;
    facts: Fact[];
    /** 버튼 3상태. 앱과 같다 — 혼자 [시작] · 결성 [준비] · 마지막 주자 [시작]. */
    states: { tag: string; btn: string; count?: string }[];
  };
  bump: {
    title: string;
    lede: string;
    countLabel: string;
    alt: string;
    facts: Fact[];
  };
  live: { title: string; lede: string; alt: string; facts: Fact[] };
  card: {
    title: string;
    lede: string;
    cardAlt: string;
    activityAlt: string;
    facts: Fact[];
    /** 기록 아카이브 — 카드 섹션 안의 두 번째 마디. */
    archive: { title: string; body: string };
  };
  features: {
    title: string;
    lede: string;
    items: { title: string; body: string; runner: number }[];
  };
  cta: { title: string[]; lede: string; ctaPrimary: string; ctaSecondary: string };
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
        "거리와 페이스를 추정 없이 재는 러닝 앱. 옆 사람과 폰을 가까이 모으면 그 자리에서 함께 뛸 그룹이 만들어지고, 그날의 러닝은 한 장의 카드로 남습니다.",
    },
    nav: { oneStart: "하나의 Start", bump: "맞댐", card: "러닝 카드", features: "기능", cta: "App Store" },
    hero: {
      beats: [
        {
          h: ["오늘의 러닝을,", "정확하게"],
          p: "GPS와 걸음을 함께 읽어 거리·페이스·고도·케이던스를 추정 없이 잽니다.",
        },
        {
          h: ["맞대면,", "그 자리에서 함께"],
          accent: 1,
          p: "옆 사람과 폰을 가까이 모으면 함께 뛸 그룹이 만들어집니다. 방도, 초대 링크도, 친구 추가도 없이.",
        },
        {
          h: ["그리고 한 장으로", "남는다"],
          p: "러닝이 끝나는 순간 카드는 이미 완성돼 있습니다. 함께 뛴 사람마다 다른 색의 경로가 겹쳐 그려집니다.",
        },
      ],
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "어떻게 뛰나요",
      backdropAlt: "황혼의 물가를 달리던 두 러너가 만나 폰을 가까이 모으고 다시 함께 달려간다",
    },
    oneStart: {
      title: "버튼은 하나다",
      lede: "혼자 뛸지 같이 뛸지 고르는 화면도, 토글도 없습니다. 같은 자리의 같은 버튼이 이름과 인원만 바꿉니다.",
      states: [
        { tag: "혼자", btn: "시작" },
        { tag: "맞대면", btn: "준비", count: "2" },
        { tag: "마지막 주자", btn: "시작", count: "5" },
      ],
      facts: [
        {
          k: "그냥 누르면 혼자",
          v: "목표도 코스도 전부 선택이고 기본값은 그냥 달리기입니다. 누르면 3·2·1 뒤에 출발합니다.",
        },
        {
          k: "맞대면 인원이 붙는다",
          v: "결성되면 버튼이 준비로 바뀌고, 누를 때마다 카운터가 차오릅니다. 누가 준비됐는지 서로 보입니다.",
        },
        {
          k: "마지막 한 사람이 시작",
          v: "한 명만 남으면 그 사람의 버튼이 다시 시작이 되고, 전원이 같은 순간에 출발합니다.",
        },
      ],
    },
    bump: {
      title: "그 자리에서 우리가 된다",
      lede:
        "함께 뛸 사람과 폰을 가까이 모으세요. 가까이 댄 사람만 우리가 되고, 인원이 하나씩 올라갑니다. 흔들거나 부딪칠 필요는 없습니다.",
      countLabel: "함께 뛸 사람",
      alt: "두 iPhone이 가까워지면 함께 뛸 사람이 1에서 2가 된다",
      facts: [
        {
          k: "가까이 댄 사람만",
          v: "200명이 뛰는 한강에서도 옆에서 폰을 모은 사람만 합류합니다. 모르는 러너가 섞이지 않습니다.",
        },
        {
          k: "2명부터 30명까지",
          v: "이미 결성된 그룹에 한 명이 더 대면 그대로 합류하고, 두 그룹이 대면 하나로 합쳐집니다.",
        },
        {
          k: "안 되면 합류 요청",
          v: "정밀 거리 측정이 안 되는 기기거나 8초 동안 결성되지 않으면 합류 요청이 열립니다. 상대가 수락해야 들어옵니다.",
        },
      ],
    },
    live: {
      title: "달리는 동안, 서로가 보인다",
      lede: "함께 뛰는 사람들의 위치와 페이스가 같은 순간 흐릅니다. 지도 위에서 서로가 어디쯤인지 보입니다.",
      alt: "러닝 화면 — 거리와 평균·현재 페이스, 케이던스와 고도",
      facts: [
        {
          k: "실시간 위치·페이스",
          v: "서로의 위치가 지도 위에서 함께 흐르고, 그룹 거리와 평균 페이스가 위에 고정됩니다.",
        },
        { k: "하이파이브", v: "달리다 동료를 탭하면 상대의 손목에 진동으로 전해집니다." },
        { k: "흩어져도 괜찮다", v: "각자의 속도로 벌어져도 하나의 세션입니다. 따라잡으라고 재촉하지 않습니다." },
        { k: "끊겨도 잃지 않는다", v: "연결이 끊겨도 기록은 그대로 쌓이고, 다시 붙으면 세션이 복원됩니다." },
      ],
    },
    card: {
      title: "끝나면, 이미 만들어져 있다",
      lede: "러닝이 끝나는 순간 카드는 완성돼 있습니다. 개인용과 단체용을 따로 만들지 않고 한 장만 남깁니다.",
      cardAlt: "러닝 카드 — 함께 뛴 다섯 사람의 경로가 각자의 색으로 겹쳐 그려져 있다",
      activityAlt: "활동 화면 — 지금까지 이어 온 거리와 함께 만든 러닝",
      facts: [
        {
          k: "배경은 셋 중 하나",
          v: "시그니처 색, 내 사진, 지도. 사진은 내 기기에만 남고 다른 사람에게는 시그니처로 보입니다.",
        },
        { k: "내 경로만, 또는 전원의 경로", v: "함께 뛴 사람마다 다른 색으로 겹쳐 그립니다." },
        { k: "요소를 직접 옮긴다", v: "숫자와 경로의 자리를 손으로 잡습니다. 간단하게도, 자세하게도." },
      ],
      archive: {
        title: "그리고 쌓인다",
        body: "지금까지 이어 온 거리, 함께 만든 러닝, 평균 페이스와 심박까지 한 화면에 모입니다. 솔로와 함께를 나눠 돌아보고, 각 기록은 다시 한 장의 카드로 열립니다.",
      },
    },
    features: {
      title: "러닝에 필요한 나머지",
      lede: "함께 뛰는 순간 밖에서도, 러닝을 이어 가는 데 필요한 것들.",
      items: [
        {
          title: "실측 러닝 지표",
          body: "GPS와 걸음을 함께 읽어 거리·페이스·고도·케이던스를 추정 없이 측정합니다.",
          runner: 0,
        },
        { title: "Apple Watch", body: "손목에서 시작하고 심박을 함께 기록합니다.", runner: 5 },
        {
          title: "라이브 액티비티 · 위젯",
          body: "잠금 화면과 다이내믹 아일랜드에서 러닝 현황을 확인합니다.",
          runner: 3,
        },
        { title: "건강 앱 연동", body: "완료한 러닝을 건강 앱으로 내보냅니다.", runner: 7 },
        { title: "음성 코치", body: "페이스와 구간을 목소리로 짚어 줍니다.", runner: 1 },
        { title: "경로 리플레이", body: "달린 길을 다시 재생하며 그날의 러닝을 돌아봅니다.", runner: 2 },
      ],
    },
    cta: {
      title: ["오늘도,", "달릴까요"],
      lede: "옆에 누가 있으면 같이, 없으면 혼자. 버튼은 어느 쪽이든 하나입니다.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "도움이 필요하면",
    },
    footer: {
      tagline: "맞대면 그 자리에서\n함께 뛰는 러닝 앱.",
      cols: [
        {
          head: "제품",
          links: [
            { label: "하나의 Start", href: "#onestart" },
            { label: "맞댐", href: "#bump" },
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
        "A running app that measures distance and pace for real. Hold your iPhone near the person beside you and a running group forms on the spot, and the run stays as one card.",
    },
    nav: { oneStart: "One Start", bump: "Bump", card: "Run Card", features: "Features", cta: "App Store" },
    hero: {
      beats: [
        {
          h: ["Today’s run,", "measured for real"],
          p: "GPS and step data read together for distance, pace, elevation and cadence — never estimated.",
        },
        {
          h: ["Bump, and you’re", "running together"],
          accent: 1,
          p: "Hold your iPhone near the person beside you and a group forms. No rooms, no invite links, no friend requests.",
        },
        {
          h: ["And it stays", "as one card"],
          p: "By the time the run ends, the card is already made. Each runner’s route is drawn in their own color, layered together.",
        },
      ],
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "How it works",
      backdropAlt:
        "Two runners meet on a waterfront at dusk, hold their phones close together, and run on side by side",
    },
    oneStart: {
      title: "There is one button",
      lede:
        "No screen and no toggle for choosing solo or group. The same button in the same place only changes its label and headcount.",
      states: [
        { tag: "Solo", btn: "Start" },
        { tag: "Bumped", btn: "Ready", count: "2" },
        { tag: "Last runner", btn: "Start", count: "5" },
      ],
      facts: [
        {
          k: "Tap it and you run solo",
          v: "Goals and courses are all optional; the default is simply to run. Tap, and you leave after 3·2·1.",
        },
        {
          k: "Bump and the headcount grows",
          v: "Once a group forms the button turns into Ready, and the counter fills as people tap. Everyone sees who is set.",
        },
        {
          k: "The last person starts it",
          v: "When one person is left, their button turns back into Start and everyone leaves in the same instant.",
        },
      ],
    },
    bump: {
      title: "You become a group on the spot",
      lede:
        "Hold your phone close to your running partner’s. Only the people you bring close become your group, and the headcount ticks up one at a time. No shaking, no tapping.",
      countLabel: "Running with you",
      alt: "Two iPhones move together and the headcount goes from 1 to 2",
      facts: [
        {
          k: "Only the people beside you",
          v: "Among two hundred runners on the riverside, only the one who brought their phone close joins. Strangers never slip in.",
        },
        {
          k: "From 2 up to 30",
          v: "Bring one more person close to a formed group and they join as is; bring two groups together and they merge into one.",
        },
        {
          k: "Join request as a fallback",
          v: "On a phone without precise distance measurement, or if nothing forms within 8 seconds, a join request opens. The other person has to accept.",
        },
      ],
    },
    live: {
      title: "While you run, you see each other",
      lede: "Everyone’s location and pace stream in the same moment. You can see where each person is on one map.",
      alt: "Running screen — distance with average and current pace, cadence and elevation",
      facts: [
        {
          k: "Live location and pace",
          v: "Everyone’s position flows on one map, with group distance and average pace pinned on top.",
        },
        { k: "High five", v: "Tap a partner while you run and it lands as a buzz on their wrist." },
        {
          k: "Spreading out is fine",
          v: "Run at your own pace and it is still one session. Nobody is nudged to catch up.",
        },
        {
          k: "A drop loses nothing",
          v: "Your record keeps building through a disconnect, and the session is restored when it reattaches.",
        },
      ],
    },
    card: {
      title: "When you stop, it is already made",
      lede:
        "By the time the run ends, the card is finished. One card — never separate personal and group versions.",
      cardAlt: "A running card — five runners’ routes layered, each in their own color",
      activityAlt: "Activity screen — the distance carried so far and the runs made together",
      facts: [
        {
          k: "One of three backdrops",
          v: "Signature color, your own photo, or the map. Photos stay on your phone; everyone else sees the signature.",
        },
        {
          k: "Your route, or everyone’s",
          v: "Each runner’s route is drawn in their own color, layered together.",
        },
        { k: "Move the pieces yourself", v: "Place the numbers and the route by hand. Simple, or detailed." },
      ],
      archive: {
        title: "And it adds up",
        body: "The distance you’ve carried this far, the runs you made together, average pace and heart rate — gathered into one screen. Look back at solo and together separately, and open any record as a card again.",
      },
    },
    features: {
      title: "Everything else a run needs",
      lede: "Beyond the moment you run together, everything you need to keep running.",
      items: [
        {
          title: "Measured run metrics",
          body: "GPS and step data read together for distance, pace, elevation and cadence — never estimated.",
          runner: 0,
        },
        { title: "Apple Watch", body: "Start from your wrist and record heart rate alongside.", runner: 5 },
        {
          title: "Live Activity · Widgets",
          body: "Check your run from the Lock Screen and Dynamic Island.",
          runner: 3,
        },
        { title: "Health app", body: "Export finished runs to the Health app.", runner: 7 },
        { title: "Voice coach", body: "Pace and splits called out in your ear.", runner: 1 },
        { title: "Route replay", body: "Play the path back and revisit that day’s run.", runner: 2 },
      ],
    },
    cta: {
      title: ["Shall we run", "today?"],
      lede: "Together if someone’s beside you, solo if not. Either way there is one button.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "Need a hand?",
    },
    footer: {
      tagline: "Bump, and run together\non the spot.",
      cols: [
        {
          head: "Product",
          links: [
            { label: "One Start", href: "#onestart" },
            { label: "Bump", href: "#bump" },
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
