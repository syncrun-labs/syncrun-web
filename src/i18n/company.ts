/* 회사 소개 페이지 카피 — 한국어/영어. 사업자 정보의 실제 값은 `lib/company.ts`에 있고
   여기에는 라벨과 문장만 둔다. 두 언어의 절 구성이 같아야 토글이 같은 자리를 보여 준다. */

import type { Lang } from "./dict";
import type { PageMeta } from "./lang";

/** 바로가기 링크의 목적지 — 실제 주소는 페이지가 BASE_URL로 조립한다. */
export type CompanyLink = "home" | "support" | "legal" | "github";

export interface CompanyCopy {
  meta: PageMeta;
  nav: { home: string; support: string; cta: string };
  head: { lede: string };
  about: { heading: string; lede: string; cards: { h: string; p: string }[] };
  status: { heading: string; lede: string; milestones: { when: string; what: string }[] };
  stack: {
    heading: string;
    lede: string;
    items: { area: string; detail: string }[];
    reposPrefix: string;
    reposSuffix: string;
  };
  business: {
    heading: string;
    lede: string;
    labels: {
      name: string;
      ceo: string;
      bizNo: string;
      address: string;
      industry: string;
      form: string;
      contact: string;
    };
    notePrefix: string;
    noteLink: string;
    noteSuffix: string;
  };
  contact: {
    label: string;
    note: string;
    sideLabel: string;
    links: { label: string; to: CompanyLink }[];
  };
  foot: { label: string; to: CompanyLink | "mailto" }[];
}

export const companyCopy: Record<Lang, CompanyCopy> = {
  ko: {
    meta: {
      title: "싱크런 랩스(SyncRun Labs) — 회사 소개",
      description:
        "싱크런 랩스는 경상북도 경산시의 소프트웨어 회사입니다. 폰을 맞대면 그 자리에서 그룹이 결성되는 iPhone 러닝 앱 SyncRun을 만듭니다.",
    },
    nav: { home: "홈", support: "지원", cta: "문의하기" },
    head: {
      lede: "함께 뛰는 일을 앱이 방해하지 않게 만듭니다. 옆 사람과 폰을 맞대면 그 자리에서 그룹이 결성되고, 함께 뛴 경로가 한 장의 러닝 카드로 남습니다.",
    },
    about: {
      heading: "무엇을 만드나",
      lede: "SyncRun은 iPhone용 러닝 앱입니다. 혼자 뛰든 여럿이 뛰든 시작 버튼은 하나입니다.",
      cards: [
        {
          h: "맞대면 그룹이 된다",
          p: "같이 뛰려면 보통 방을 만들고 링크를 보내고 상대가 들어오기를 기다립니다. SyncRun은 그 절차를 없앴습니다. 두 사람이 폰을 맞대면 초광대역(UWB) 근접 판정으로 서로를 확인하고 같은 세션에 들어갑니다. 이미 뛰고 있는 무리에 한 사람이 맞대면 그 무리 전체와 합쳐집니다.",
        },
        {
          h: "뛰는 동안은 화면을 보지 않아도 된다",
          p: "같은 세션의 러너들은 서로의 위치와 페이스를 실시간으로 주고받습니다. 마지막 주자가 뒤처지면 앞선 러너에게 알림이 갑니다. 달리는 사람이 화면을 들여다보지 않아도 무리가 흩어지지 않게 하는 것이 목표입니다.",
        },
        {
          h: "기록은 한 장으로 남는다",
          p: "러닝이 끝나면 경로·거리·페이스·함께 뛴 사람이 한 장의 러닝 카드가 됩니다. 카드는 지도 배경 없이 경로 라인만 그리고 장소는 동 단위로만 적습니다 — 공유하는 순간 집 위치가 드러나지 않게 하기 위한 기본값이고, 이 값은 낮출 수 없습니다.",
        },
      ],
    },
    status: {
      heading: "지금 어디까지 왔나",
      lede: "현재 TestFlight 내부 베타 단계이며, 외부 베타를 거쳐 App Store 정식 출시를 준비하고 있습니다.",
      milestones: [
        {
          when: "2026.08",
          what: "TestFlight 내부 베타 시작 — 맞댐으로 그룹이 결성되고 함께 뛴 기록이 카드로 남는 전 흐름이 실기기에서 동작",
        },
        {
          when: "2026.08",
          what: "syncrunlabs.com 개설 · 이용약관 · 개인정보 처리방침 · 위치기반서비스 이용약관 게시",
        },
        {
          when: "2026.09",
          what: "개인사업자 등록 — 싱크런 랩스(SyncRun Labs), 사업자등록번호 656-09-03142",
        },
        {
          when: "다음",
          what: "TestFlight 외부 베타 · 위치기반서비스사업 신고 · App Store 정식 출시",
        },
      ],
    },
    stack: {
      heading: "어떻게 만드나",
      lede: "팀은 소수이고, 그래서 사람이 기억해야 하는 것을 줄이는 데 시간을 씁니다. 제품 요구사항과 API 계약을 한 저장소에 모아 두고, 앱·서버·인프라가 그 문서를 따릅니다.",
      items: [
        {
          area: "iOS",
          detail:
            "SwiftUI · Nearby Interaction(UWB)로 맞댐 근접 판정 · Core Location과 Core Motion을 융합한 거리 측정 · HealthKit 심박 · watchOS 컴패니언 · 위젯",
        },
        {
          area: "서버",
          detail:
            "TypeScript · NestJS · Socket.IO 실시간 세션 · Prisma · Sign in with Apple · APNs 푸시",
        },
        {
          area: "인프라",
          detail:
            "Terraform으로 배포 상태를 코드로 관리 · GitHub Actions와 Xcode Cloud CI · 자체 도메인 뒤에 API를 두어 배포처를 갈아끼울 수 있게 유지",
        },
      ],
      reposPrefix: "저장소는 ",
      reposSuffix: "에 있습니다.",
    },
    business: {
      heading: "사업자 정보",
      lede: "아래 정보는 「서비스 이용약관」 제27조와 「위치기반서비스 이용약관」 제16조에 적힌 값과 같습니다.",
      labels: {
        name: "상호",
        ceo: "대표자",
        bizNo: "사업자등록번호",
        address: "사업장 주소",
        industry: "업태 · 종목",
        form: "사업 형태",
        contact: "문의",
      },
      notePrefix:
        "서비스는 전부 무상으로 제공되어 통신판매업 신고 대상이 아닙니다. 위치기반서비스사업 신고는 준비 중이며, 신고번호를 받는 대로 ",
      noteLink: "위치기반서비스 이용약관",
      noteSuffix: " 제16조에 기재하고 공지합니다.",
    },
    contact: {
      label: "연락",
      note: "제휴·채용·취재 문의도 같은 주소로 받습니다. 보통 2~3 영업일 안에 회신합니다.",
      sideLabel: "바로가기",
      links: [
        { label: "제품 소개", to: "home" },
        { label: "지원 · 도움말", to: "support" },
        { label: "약관 및 정책", to: "legal" },
        { label: "GitHub", to: "github" },
      ],
    },
    foot: [
      { label: "홈", to: "home" },
      { label: "지원", to: "support" },
      { label: "약관", to: "legal" },
      { label: "문의", to: "mailto" },
    ],
  },

  en: {
    meta: {
      title: "SyncRun Labs — About",
      description:
        "SyncRun Labs is a software company in Gyeongsan, Republic of Korea. We build SyncRun, an iPhone running app where two runners tap phones and a group run starts on the spot.",
    },
    nav: { home: "Home", support: "Support", cta: "Contact us" },
    head: {
      lede: "We keep the app out of the way of running together. Tap phones with the person beside you and a group forms on the spot; the run you share becomes a single run card.",
    },
    about: {
      heading: "What we build",
      lede: "SyncRun is a running app for iPhone. Solo or in a group, there is one Start button.",
      cards: [
        {
          h: "Tap phones, and you are a group",
          p: "Running together usually means creating a room, sending a link, and waiting for someone to join. SyncRun drops all of it. Two people tap their phones, an ultra-wideband proximity check confirms they are face to face, and both enter the same session. One tap also merges a newcomer into a group that is already running.",
        },
        {
          h: "No need to watch the screen while you run",
          p: "Everyone in a session exchanges live position and pace, and the runners ahead are notified when the last runner falls behind. The goal is for the group to stay together without anyone staring at a screen.",
        },
        {
          h: "The run is kept as one card",
          p: "When a run ends, the route, distance, pace and the people you ran with become a single run card. The card draws the route line without a map background and names the place only down to the neighbourhood — a default that keeps a shared card from revealing where someone lives, and one that cannot be loosened.",
        },
      ],
    },
    status: {
      heading: "Where we are",
      lede: "The app is in closed TestFlight beta. An open beta and the App Store release are being prepared.",
      milestones: [
        {
          when: "2026.08",
          what: "Closed TestFlight beta — the full loop runs on real devices: tap to form a group, run together, keep the run as a card",
        },
        {
          when: "2026.08",
          what: "syncrunlabs.com goes live · terms of service, privacy policy and location-based service terms published",
        },
        {
          when: "2026.09",
          what: "Registered as a business — SyncRun Labs, business registration no. 656-09-03142",
        },
        {
          when: "Next",
          what: "Open TestFlight beta · location-based service provider filing · App Store release",
        },
      ],
    },
    stack: {
      heading: "How we build",
      lede: "The team is small, so we spend our time cutting down what a person has to remember. Product requirements and API contracts live in one repository, and the app, server and infrastructure follow those documents.",
      items: [
        {
          area: "iOS",
          detail:
            "SwiftUI · Nearby Interaction (UWB) for the tap-to-pair proximity check · distance fused from Core Location and Core Motion · HealthKit heart rate · watchOS companion · widgets",
        },
        {
          area: "Server",
          detail:
            "TypeScript · NestJS · Socket.IO live sessions · Prisma · Sign in with Apple · APNs push",
        },
        {
          area: "Infrastructure",
          detail:
            "Deployment state managed as code in Terraform · GitHub Actions and Xcode Cloud CI · the API sits behind our own domain so the host can be swapped without shipping an app update",
        },
      ],
      reposPrefix: "Our repositories are at ",
      reposSuffix: ".",
    },
    business: {
      heading: "Business information",
      lede: "These are the same values recorded in Article 27 of the Terms of Service and Article 16 of the Location-Based Service Terms.",
      labels: {
        name: "Legal name",
        ceo: "Representative",
        bizNo: "Business registration no.",
        address: "Registered address",
        industry: "Industry",
        form: "Entity type",
        contact: "Contact",
      },
      notePrefix:
        "The service is provided free of charge, so it is not subject to mail-order business registration. The location-based service provider filing is in preparation; once the filing number is issued we will record it in Article 16 of the ",
      noteLink: "Location-Based Service Terms",
      noteSuffix: " and announce it.",
    },
    contact: {
      label: "Contact",
      note: "Partnerships, hiring and press reach us at the same address. We usually reply within 2–3 business days.",
      sideLabel: "Elsewhere",
      links: [
        { label: "Product", to: "home" },
        { label: "Support · Help", to: "support" },
        { label: "Terms & policies", to: "legal" },
        { label: "GitHub", to: "github" },
      ],
    },
    foot: [
      { label: "Home", to: "home" },
      { label: "Support", to: "support" },
      { label: "Legal", to: "legal" },
      { label: "Contact", to: "mailto" },
    ],
  },
};
