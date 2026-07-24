/* 랜딩 카피 — 한국어/영어. 제품 메시지는 syncrun 허브의 현재 사실을 따른다.
   구조: dict[lang].<섹션>.<키>. 컴포넌트는 useLang()의 t로 접근한다. */

export type Lang = "ko" | "en";

export interface Dict {
  meta: { title: string; description: string };
  nav: { how: string; card: string; activity: string; features: string; cta: string };
  hero: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    chips: string[];
    scroll: string;
  };
  oneStart: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    points: string[];
    solo: string;
    together: string;
    soloBtn: string;
    togetherBtn: string;
    bump: string;
  };
  bump: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    lede: string;
    stats: { value: string; unit: string; label: string }[];
    note: string;
  };
  live: {
    eyebrow: string;
    title: string;
    lede: string;
    metrics: { k: string; v: string }[];
  };
  card: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    lede: string;
    edits: string[];
    watermark: string;
  };
  activity: {
    eyebrow: string;
    title: string;
    lede: string;
    facts: { k: string; v: string }[];
  };
  stats: { to: number; suffix: string; decimals: number; k: string }[];
  features: {
    eyebrow: string;
    title: string;
    lede: string;
    items: { tag: string; title: string; body: string; runner: number; wide?: boolean }[];
  };
  cta: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  footer: {
    tagline: string;
    cols: { head: string; links: { label: string; href: string }[] }[];
    rights: string;
    made: string;
  };
  common: { appStore: string; langName: string; comingSoon: string };
}

/* 지원/약관은 라우터 없는 별도 HTML 페이지다(vite rollup input). Footer가 BASE_URL을 붙인다. */
const SUPPORT = "support";
const LEGAL = "legal";

export const dict: Record<Lang, Dict> = {
  ko: {
    meta: {
      title: "SyncRun — 맞대면, 그 자리에서 함께 뛴다",
      description:
        "옆 사람과 iPhone을 맞대면 그 자리에서 함께 뛸 그룹이 결성되고, 함께 뛴 기록이 한 장의 러닝 카드가 됩니다. 솔로와 그룹은 하나의 Start.",
    },
    nav: { how: "하나의 Start", card: "러닝 카드", activity: "이야기", features: "기능", cta: "App Store" },
    hero: {
      eyebrow: "iOS · 함께 뛰는 러닝",
      titleTop: "맞대면, 그 자리에서",
      titleAccent: "함께 뛴다",
      lede:
        "옆 사람과 iPhone을 맞대는 순간 함께 뛸 그룹이 결성됩니다. 방 만들기도, 초대 링크도 없이 — 함께 뛴 경로는 한 장의 러닝 카드로 남습니다.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "작동 방식 보기",
      chips: ["UWB · 20cm", "0.4초 확정", "외부 의존성 0", "SwiftUI · Liquid Glass"],
      scroll: "SCROLL",
    },
    oneStart: {
      eyebrow: "하나의 Start",
      titleLead: "솔로와 그룹은 모드가 아니라",
      titleAccent: "상태다",
      points: [
        "그냥 누르면 혼자, 옆 사람과 맞대면 함께 — 같은 자리의 같은 버튼이 라벨과 색만 바꿉니다.",
        "솔로용·그룹용 화면을 따로 두지 않습니다. 하나의 Start, 하나의 러닝, 하나의 결과.",
        "어떤 상태에서도 기록은 저장 중입니다. 연결이 끊겨도 잃지 않습니다.",
      ],
      solo: "혼자",
      together: "함께",
      soloBtn: "러닝 시작",
      togetherBtn: "함께 시작",
      bump: "맞댐",
    },
    bump: {
      eyebrow: "맞댐 · Bump",
      titleTop: "폰을 맞대면,",
      titleAccent: "그 자리에서 결성",
      lede:
        "함께 뛸 사람과 iPhone 상단을 가까이 대세요. UWB로 20cm·0.4초를 확인하면 자동으로 같은 세션에 합류합니다. 흔들기도, 충격도 필요 없습니다.",
      stats: [
        { value: "20", unit: "cm", label: "맞댐 인식 거리" },
        { value: "0.4", unit: "초", label: "결성 확정 시간" },
      ],
      note: "UWB(초광대역)로 방향과 거리를 함께 읽어 옆 사람만 정확히 잡습니다.",
    },
    live: {
      eyebrow: "실시간 · 실측",
      title: "달리는 동안, 서로가 보인다",
      lede:
        "함께 뛰는 사람들의 위치와 페이스가 같은 순간 흐릅니다. 거리·페이스·고도·케이던스는 추정 없이 실제로 측정해요.",
      metrics: [
        { k: "실시간 위치", v: "서로의 위치가 지도 위에서 함께 흐릅니다." },
        { k: "라이브 페이스", v: "동행자의 거리·페이스가 초 단위로 갱신됩니다." },
        { k: "끊겨도 이어달리기", v: "연결이 끊기면 재부착으로 세션과 기록을 그대로 복원합니다." },
      ],
    },
    card: {
      eyebrow: "루트 아트 · 러닝 카드",
      titleLead: "함께 뛴 경로가",
      titleAccent: "한 장의 작품",
      titleTail: "이 된다",
      lede:
        "러닝이 끝나면 카드는 이미 완성돼 있습니다. 개인·단체를 따로 만들지 않고 한 장만 남기며, 내 경로만 또는 전원의 경로를 겹쳐 보여주도록 편집할 수 있습니다.",
      edits: ["내 경로만 · 전원 경로", "배경 · 템플릿", "표시 항목 · 규격", "한 번에 공유"],
      watermark: "SyncRun",
    },
    activity: {
      eyebrow: "이야기 · Activity",
      title: "모든 러닝이 이야기가 된다",
      lede:
        "지금까지 이어 온 거리, 함께 만든 러닝, 평균 페이스와 심박까지 — 한 화면의 이야기로 모입니다. 솔로와 함께를 나눠 돌아보고, 각 기록은 다시 한 장의 카드로 열립니다.",
      facts: [
        { k: "총 이야기", v: "지금까지 이어 온 모든 러닝의 합" },
        { k: "함께 만든 이야기", v: "맞대어 함께 뛴 거리만 따로" },
        { k: "실측 지표", v: "평균 페이스·심박까지 측정값 그대로" },
      ],
    },
    stats: [
      { to: 20, suffix: "cm", decimals: 0, k: "맞댐 인식 거리" },
      { to: 0.4, suffix: "초", decimals: 1, k: "결성 확정 시간" },
      { to: 100, suffix: "%", decimals: 0, k: "GPS 실측 지표" },
      { to: 0, suffix: "", decimals: 0, k: "외부 런타임 의존성" },
    ],
    features: {
      eyebrow: "더 많은 것",
      title: "러닝에 필요한 모든 것",
      lede: "함께 뛰는 순간 밖에서도, 러닝을 이어 가는 데 필요한 것들.",
      items: [
        { tag: "기록", title: "실측 러닝 지표", body: "CoreLocation 거리·페이스·고도에 케이던스까지, 추정 없이 실제로 측정합니다.", runner: 0, wide: true },
        { tag: "기기", title: "Apple Watch", body: "손목에서 시작하고 심박을 함께 기록합니다.", runner: 5 },
        { tag: "화면", title: "라이브 액티비티 · 위젯", body: "잠금 화면과 다이내믹 아일랜드에서 러닝 현황을 확인합니다.", runner: 3 },
        { tag: "연동", title: "HealthKit 연동", body: "완료한 러닝을 건강 앱으로 내보냅니다.", runner: 7 },
        { tag: "코칭", title: "음성 코치", body: "페이스와 구간을 목소리로 짚어 줍니다.", runner: 1 },
        { tag: "돌아보기", title: "경로 리플레이", body: "달린 길을 다시 재생하며 그날의 러닝을 돌아봅니다.", runner: 2, wide: true },
      ],
    },
    cta: {
      eyebrow: "지금 시작",
      titleTop: "다음 러닝은,",
      titleAccent: "함께.",
      lede: "옆 사람과 폰을 맞대는 순간, 오늘의 러닝이 함께가 됩니다.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "GitHub 살펴보기",
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
            { label: "지원 · 도움말", href: `${SUPPORT}` },
            { label: "권한 안내", href: `${SUPPORT}#permissions` },
            { label: "문의", href: "mailto:sjsb4838@gmail.com?subject=%5BSyncRun%20%EB%AC%B8%EC%9D%98%5D" },
          ],
        },
        {
          head: "약관",
          links: [
            { label: "이용약관", href: `${LEGAL}#terms` },
            { label: "개인정보 처리방침", href: `${LEGAL}#privacy` },
            { label: "위치기반서비스", href: `${LEGAL}#location` },
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
      rights: "© 2026 SyncRun Labs",
      made: "Made with React Bits · Liquid Glass",
    },
    common: { appStore: "App Store", langName: "한국어", comingSoon: "곧 출시" },
  },

  en: {
    meta: {
      title: "SyncRun — Bump. And you’re running together.",
      description:
        "Touch phones with the person beside you and a running group forms on the spot. Every shared run becomes one running card. Solo and group share one Start.",
    },
    nav: { how: "One Start", card: "Run Card", activity: "Story", features: "Features", cta: "App Store" },
    hero: {
      eyebrow: "iOS · Run together",
      titleTop: "Bump. And you’re",
      titleAccent: "running together.",
      lede:
        "Touch iPhones with the person next to you and a running group forms in that instant. No rooms, no invite links — and the route you run together stays as one running card.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "See how it works",
      chips: ["UWB · 20cm", "0.4s to form", "Zero dependencies", "SwiftUI · Liquid Glass"],
      scroll: "SCROLL",
    },
    oneStart: {
      eyebrow: "One Start",
      titleLead: "Solo and group aren’t modes.",
      titleAccent: "They’re states.",
      points: [
        "Tap it and you run solo; bump the person beside you and you run together — the same button in the same place only changes its label and color.",
        "No separate screens for solo and group. One Start, one run, one result.",
        "In every state your run is already being saved. Lose the connection, never the record.",
      ],
      solo: "Solo",
      together: "Together",
      soloBtn: "Start run",
      togetherBtn: "Start together",
      bump: "bump",
    },
    bump: {
      eyebrow: "Bump",
      titleTop: "Bump phones,",
      titleAccent: "form on the spot",
      lede:
        "Hold the top of your iPhone near your running partner’s. Confirmed within 20cm in 0.4 seconds over UWB, you both join the same session automatically. No shaking, no tap-to-impact.",
      stats: [
        { value: "20", unit: "cm", label: "Bump detection range" },
        { value: "0.4", unit: "s", label: "Time to confirm" },
      ],
      note: "Ultra-wideband reads direction and distance together, so it locks onto the person beside you — and only them.",
    },
    live: {
      eyebrow: "Live · Measured",
      title: "While you run, you see each other",
      lede:
        "Everyone’s location and pace stream in the same moment. Distance, pace, elevation and cadence are all measured for real — never estimated.",
      metrics: [
        { k: "Live location", v: "Everyone’s position flows together on one map." },
        { k: "Live pace", v: "Your partners’ distance and pace update by the second." },
        { k: "Reattach & continue", v: "Drop the connection and it restores the session and record on reattach." },
      ],
    },
    card: {
      eyebrow: "Route Art · Run Card",
      titleLead: "The route you ran together",
      titleAccent: "becomes a piece of art",
      titleTail: "",
      lede:
        "By the time the run ends, the card is already made. One card — never separate personal and group versions — and you can edit it to show just your route or everyone’s routes layered together.",
      edits: ["My route · all routes", "Backdrop · template", "Fields · format", "Share in one tap"],
      watermark: "SyncRun",
    },
    activity: {
      eyebrow: "Story · Activity",
      title: "Every run becomes a story",
      lede:
        "The distance you’ve carried this far, the runs you made together, average pace and heart rate — all gathered into one screen. Look back at solo and together separately, and open any record as a card again.",
      facts: [
        { k: "Total story", v: "The sum of every run you’ve carried so far" },
        { k: "Made together", v: "Only the distance you bumped and ran together" },
        { k: "Measured metrics", v: "Average pace and heart rate, exactly as measured" },
      ],
    },
    stats: [
      { to: 20, suffix: "cm", decimals: 0, k: "Bump detection range" },
      { to: 0.4, suffix: "s", decimals: 1, k: "Time to confirm" },
      { to: 100, suffix: "%", decimals: 0, k: "GPS-measured metrics" },
      { to: 0, suffix: "", decimals: 0, k: "External runtime deps" },
    ],
    features: {
      eyebrow: "And more",
      title: "Everything a run needs",
      lede: "Beyond the moment you run together, everything you need to keep running.",
      items: [
        { tag: "Metrics", title: "Measured run metrics", body: "CoreLocation distance, pace and elevation plus cadence — measured for real, never estimated.", runner: 0, wide: true },
        { tag: "Device", title: "Apple Watch", body: "Start from your wrist and record heart rate alongside.", runner: 5 },
        { tag: "Screen", title: "Live Activity · Widgets", body: "Check your run from the Lock Screen and Dynamic Island.", runner: 3 },
        { tag: "Sync", title: "HealthKit", body: "Export finished runs to the Health app.", runner: 7 },
        { tag: "Coaching", title: "Voice coach", body: "Pace and splits called out in your ear.", runner: 1 },
        { tag: "Replay", title: "Route replay", body: "Play the path back and revisit that day’s run.", runner: 2, wide: true },
      ],
    },
    cta: {
      eyebrow: "Start now",
      titleTop: "Your next run,",
      titleAccent: "together.",
      lede: "The moment you touch phones with the person beside you, today’s run becomes a shared one.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "Explore on GitHub",
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
            { label: "Support · Help", href: `${SUPPORT}` },
            { label: "Permissions", href: `${SUPPORT}#permissions` },
            { label: "Contact", href: "mailto:sjsb4838@gmail.com?subject=%5BSyncRun%5D" },
          ],
        },
        {
          head: "Legal",
          links: [
            { label: "Terms of Service", href: `${LEGAL}#terms` },
            { label: "Privacy Policy", href: `${LEGAL}#privacy` },
            { label: "Location Services", href: `${LEGAL}#location` },
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
      rights: "© 2026 SyncRun Labs",
      made: "Made with React Bits · Liquid Glass",
    },
    common: { appStore: "App Store", langName: "English", comingSoon: "Coming soon" },
  },
};
