/* 랜딩 카피 — 한국어/영어. 제품 메시지는 syncrun 허브의 현재 사실(requirements.md)을 따른다.
   구조: dict[lang].<장면>.<키>. 컴포넌트는 useLang()의 t로 접근한다.
   제목은 줄 단위 배열이다 — 한글 디스플레이의 줄바꿈을 자동에 맡기지 않는다. */

import { supportMailto } from "../lib/contact";

export type Lang = "ko" | "en";

/** 번호 목록의 한 줄 — 제목과 한 문장. */
export interface Fact {
  k: string;
  v: string;
}

/** 장면마다 함께 달리는 네 사람. 순서가 러너 팔레트 순서다(0 = 나). */
export type Crew = [string, string, string, string];

export interface Dict {
  meta: { title: string; description: string };
  /** 아래의 러닝 도크 — 앱의 러닝 화면 도크처럼 거리·시간이 흐르고, 장(章) 눈금이 목차다. */
  dock: { chapters: [string, string, string, string, string, string]; km: string; time: string; cta: string; walk: string };
  crew: Crew;
  hero: {
    title: [string, string];
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** 경로 아래의 누적 거리 — 혼자일 때와 모였을 때 라벨이 다르다. */
    hudSolo: string;
    hudGroup: string;
    photoAlt: string;
  };
  gather: {
    title: [string, string];
    lede: string;
    countLabel: string;
    facts: Fact[];
    /** 폰 화면 속 홈의 주 버튼 — 혼자 [러닝 시작] · 모이면 [준비]. 앱과 같다. */
    btnSolo: string;
    btnReady: string;
    photoAlt: string;
  };
  start: { title: string; lede: string; go: string; photoAlt: string };
  together: {
    title: [string, string];
    lede: string;
    /** 워치에 뜨는 응원 — 보낸 사람 이름 뒤에 붙는다. */
    cheer: string;
    cheerSub: string;
    photoAlt: string;
    spreadAlt: string;
  };
  tunnel: {
    title: [string, string];
    lede: string;
    gps: string;
    steps: string;
    photoAlt: string;
  };
  card: {
    title: [string, string];
    lede: string;
    facts: Fact[];
    /** 카드 안의 글자 — 앱의 단체 카드와 같은 자리에 같은 항목만 둔다. */
    date: string;
    together: string;
    pace: string;
    runners: string;
    replay: string;
    photoAlt: string;
    cardAlt: string;
  };
  cta: { title: [string, string]; lede: string; ctaPrimary: string; ctaSecondary: string };
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
      title: "SyncRun — 달린 길은 선이 된다",
      description:
        "혼자 뛰면 한 줄, 옆 사람과 폰을 가운데로 모으면 여러 줄. GPS와 걸음으로 거리를 재고, 끝나면 함께 달린 선이 한 장의 카드로 남는 러닝 앱.",
    },
    dock: {
      chapters: ["출발 전", "모으기", "3 · 2 · 1", "함께", "터널", "카드"],
      km: "거리",
      time: "시간",
      cta: "App Store에서 받기",
      walk: "아래로 스크롤하면 앞으로 달립니다",
    },
    crew: ["나", "서연", "하은", "도윤"],
    hero: {
      title: ["달린 길은 선이 되고,", "같이 달린 길은 겹칩니다."],
      lede: "혼자 뛰면 한 줄, 옆 사람과 폰을 모으고 뛰면 여러 줄. 끝나면 그 선이 한 장의 카드로 남습니다.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "어떻게 모이나요",
      hudSolo: "오늘 나",
      hudGroup: "오늘 우리",
      photoAlt: "밤의 강변 산책로. 가로등이 젖은 길을 비추고 멀리 다리 불빛이 이어진다",
    },
    gather: {
      title: ["폰을 가운데로 모으면,", "그 자리에서 한 팀."],
      lede: "함께 뛸 사람과 폰을 1m 안으로 모으세요. 1초 남짓 머물면 그룹이 되고, 모은 사람 수만큼 인원이 올라갑니다. 흔들거나 부딪칠 필요는 없습니다.",
      countLabel: "함께 뛸 사람",
      facts: [
        {
          k: "모은 사람만 들어온다",
          v: "200명이 뛰는 강변에서도 폰을 모은 사람만 합류합니다. 옆을 스쳐 가는 폰은 들어오지 않습니다.",
        },
        {
          k: "2명부터 30명까지",
          v: "이미 모인 그룹에 한 명이 더 모으면 그대로 합류하고, 두 그룹이 모으면 하나가 됩니다.",
        },
        {
          k: "혼자면 그냥 시작",
          v: "아무와도 모으지 않았다면 같은 버튼이 혼자 뛰는 시작 버튼입니다. 고를 모드가 따로 없습니다.",
        },
      ],
      btnSolo: "러닝 시작",
      btnReady: "준비",
      photoAlt: "위에서 내려다본 네 사람의 손이 폰을 원 가운데로 모으고 있다",
    },
    start: {
      title: "모두 같은 순간에.",
      lede: "마지막 한 사람이 시작을 누르면 모두의 화면에서 같은 숫자가 돌고, 같은 순간에 출발합니다. 화면을 잠가 두어도 출발 시각은 같습니다.",
      go: "출발",
      photoAlt: "젖은 아스팔트 위 흰 선 뒤에 네 사람의 러닝화가 나란히 서 있다",
    },
    together: {
      title: ["흩어져도,", "같이 뛰는 중입니다."],
      lede: "페이스가 달라 멀어져도 그룹은 그대로입니다. 달리는 동안 서로의 거리와 페이스가 보이고, 이름을 한 번 누르면 그 사람 손목에 하이파이브가 닿습니다.",
      cheer: "하이파이브",
      cheerSub: "함께 달리며 보냄",
      photoAlt: "달리는 중인 손목의 워치에 동료가 보낸 하이파이브가 떠 있다",
      spreadAlt: "같은 곳에서 출발한 네 선이 각자의 속도로 벌어져 서로 다른 거리에서 멈춘다",
    },
    tunnel: {
      title: ["신호가 끊겨도,", "선은 이어집니다."],
      lede: "지하차도나 고가 아래처럼 위치 신호가 약한 곳에서는 배운 보폭으로 걸음이 거리를 이어받습니다. 신호가 돌아와도 거리가 한꺼번에 몰려 들어오지 않아 페이스가 튀지 않습니다.",
      gps: "위치로 재는 중",
      steps: "걸음으로 재는 중",
      photoAlt: "주황색 조명이 늘어선 지하차도 입구와 젖은 바닥",
    },
    card: {
      title: ["끝나면,", "카드는 이미 있습니다."],
      lede: "러닝을 마치는 순간 카드는 완성돼 있습니다. 고를 템플릿도, 꾸밀 단계도 없습니다. 같이 뛴 사람마다 다른 색 선이 겹치고, 모두의 거리를 합친 숫자가 함께 남습니다.",
      facts: [
        {
          k: "열 때마다 선이 다시 그려진다",
          v: "카드를 열면 출발점부터 경로가 한 번 그려집니다. 먼저 끝낸 사람의 선이 먼저 도착합니다.",
        },
        {
          k: "기본 카드에는 지도가 없다",
          v: "기본 배경은 브랜드 색 위에 경로 모양만 남깁니다. 사진이나 지도로 바꿀 수 있고, 장소는 동 단위까지만 적힙니다.",
        },
        {
          k: "스토리 규격 영상으로",
          v: "경로가 그려지는 모습을 9:16 영상으로 내보내 바로 올릴 수 있습니다.",
        },
      ],
      date: "9. 24. (목)",
      together: "오늘 우리",
      pace: "평균 페이스",
      runners: "러너",
      replay: "다시 그리기",
      photoAlt: "러닝을 마치고 편의점 앞에 앉아 폰으로 카드를 보는 손",
      cardAlt: "코랄 배경의 단체 러닝 카드. 네 사람의 경로가 색별로 겹쳐 있고 합산 거리 16.40km가 적혀 있다",
    },
    cta: {
      title: ["오늘 저녁,", "한 줄 긋고 오세요."],
      lede: "App Store에서 무료로 받을 수 있습니다. iPhone · iOS 18 이상.",
      ctaPrimary: "App Store에서 받기",
      ctaSecondary: "도움이 필요하면",
    },
    footer: {
      tagline: "달린 길은 선이 되고,\n같이 달린 길은 겹친다.",
      cols: [
        {
          head: "제품",
          links: [
            { label: "모으기", href: "#gather" },
            { label: "함께 출발", href: "#start" },
            { label: "러닝 카드", href: "#card" },
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
      title: "SyncRun — Every run leaves a line",
      description:
        "Run alone and it's one line. Bring your phones together and it's several. SyncRun measures with GPS and your steps, and turns the lines you ran together into one card.",
    },
    dock: {
      chapters: ["Before", "Gather", "3 · 2 · 1", "Together", "Tunnel", "Card"],
      km: "Distance",
      time: "Time",
      cta: "Download on the App Store",
      walk: "Scroll down to run forward",
    },
    crew: ["Me", "Seoyeon", "Haeun", "Doyun"],
    hero: {
      title: ["Every run leaves a line.", "Run together, and they overlap."],
      lede: "Run alone and it's one line. Bring your phones together before you start and it's several. When you finish, the lines are already a card.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "How to gather",
      hudSolo: "Me today",
      hudGroup: "Us today",
      photoAlt: "A riverside path at night, street lights on wet asphalt and bridge lights in the distance",
    },
    gather: {
      title: ["Bring your phones together,", "and you're a crew."],
      lede: "Hold your phones within a meter of each other. After about a second you're grouped, and the count goes up with every person who joins. No shaking, no tapping phones.",
      countLabel: "Running together",
      facts: [
        {
          k: "Only the phones you gather",
          v: "Even on a riverside with two hundred runners, only the phones held together join. Someone jogging past stays out.",
        },
        {
          k: "Two to thirty people",
          v: "One more person can join a group that's already formed, and two groups that gather become one.",
        },
        {
          k: "Alone? Just start",
          v: "If you didn't gather with anyone, the same button starts a solo run. There's no mode to pick.",
        },
      ],
      btnSolo: "Start run",
      btnReady: "Ready",
      photoAlt: "Seen from above, four hands bring their phones toward the center of a circle",
    },
    start: {
      title: "Everyone starts at once.",
      lede: "When the last person taps Start, every screen counts down together and everyone starts at the same moment, even with the screen locked.",
      go: "Go",
      photoAlt: "Four pairs of running shoes lined up behind a white line on wet asphalt",
    },
    together: {
      title: ["Spread out,", "still running together."],
      lede: "Different paces pull you apart, but the group stays. You see each other's distance and pace, and one tap on a name sends a high five to their wrist.",
      cheer: "High five",
      cheerSub: "Sent while running",
      photoAlt: "A high five from a teammate on the watch of a runner mid-stride",
      spreadAlt: "Four lines leave the same point, spread out at their own speeds and stop at different distances",
    },
    tunnel: {
      title: ["Lose the signal,", "keep the line."],
      lede: "Where GPS drops out, under a bridge or through an underpass, your steps carry the distance using the stride SyncRun has learned. When the signal returns, the distance doesn't arrive in one lump, so your pace doesn't spike.",
      gps: "Measuring by GPS",
      steps: "Measuring by steps",
      photoAlt: "The entrance of an underpass lined with orange lights, the floor wet",
    },
    card: {
      title: ["When you finish,", "the card is already made."],
      lede: "No template to pick, nothing to set up. Each runner gets their own color, and everyone's distance adds up on one card.",
      facts: [
        {
          k: "The lines redraw every time",
          v: "Open the card and the route draws once from the start. Whoever finished first arrives first.",
        },
        {
          k: "No map by default",
          v: "The default card keeps only the shape of the route on the brand color. Switch to a photo or a map if you want, and places are shown only down to the neighborhood.",
        },
        {
          k: "Ready for Stories",
          v: "Export the route drawing itself as a 9:16 video and post it right away.",
        },
      ],
      date: "Thu, Sep 24",
      together: "Us today",
      pace: "Avg pace",
      runners: "Runners",
      replay: "Draw again",
      photoAlt: "Hands of a runner sitting outside a convenience store after a run, looking at the card on a phone",
      cardAlt: "A coral group run card. Four routes overlap in different colors with a combined 16.40 km",
    },
    cta: {
      title: ["Go draw a line", "tonight."],
      lede: "Free on the App Store. iPhone, iOS 18 or later.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "Need help?",
    },
    footer: {
      tagline: "Every run leaves a line.\nRun together, and they overlap.",
      cols: [
        {
          head: "Product",
          links: [
            { label: "Gather", href: "#gather" },
            { label: "Start together", href: "#start" },
            { label: "Run card", href: "#card" },
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
