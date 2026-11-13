/* 랜딩 카피(제품 설명). 사실관계는 syncrun 허브의 requirements.md를 따른다.
   두 언어의 절 구성이 같아야 언어 토글이 같은 자리를 보여 준다. */

import type { Lang } from "./dict";

interface Fact {
  k: string;
  v: string;
}

interface Plan {
  name: string;
  who: string;
  people: string;
  peopleLabel: string;
  items: string[];
}

export interface ProductCopy {
  nav: { label: string; href: string }[];
  store: string;
  hero: {
    title: [string, string, string];
    lede: string;
    note: string;
    /** Android 기기에서만 스토어 버튼 아래에 보이는 안내 */
    android: string;
    qr: string;
    altIdle: string;
    altPair: string;
  };
  how: { title: string; steps: Fact[] };
  together: { title: [string, string]; lede: string; facts: Fact[]; alt: string };
  solo: { title: [string, string]; lede: string; facts: Fact[] };
  card: {
    title: [string, string];
    lede: string;
    /** 모바일에서 옆으로 넘기는 카드 목록의 이름 */
    shotsLabel: string;
    shots: { caption: string; body: string; alt: string }[];
  };
  /** pains: 크루장의 말로 쓴 지금의 수고. facts가 차례로 그 답이다 */
  crew: { title: [string, string]; pains: string[]; lede: string; facts: Fact[]; note: string };
  /** App Store에 실제로 달린 리뷰. 숫자와 문장은 스토어와 같아야 하고, 바뀌면 asOf와 함께 고친다 */
  reviews: {
    title: string;
    rating: string;
    count: string;
    asOf: string;
    items: { quote: string; by: string }[];
    note?: string;
  };
  plans: { title: string; lede: string; items: [Plan, Plan, Plan]; note: string };
  faq: { title: string; items: { q: string; a: string }[]; more: string };
  closing: { title: [string, string]; lede: string; help: string };
}

export const productCopy: Record<Lang, ProductCopy> = {
  ko: {
    nav: [
      { label: "함께 뛰기", href: "#together" },
      { label: "혼자 뛰기", href: "#solo" },
      { label: "크루", href: "#crew" },
      { label: "러닝 카드", href: "#card" },
      { label: "플랜", href: "#plans" },
    ],
    store: "App Store에서 받기",
    hero: {
      title: ["폰을 맞대면", "바로 함께 뛰는", "러닝 앱."],
      lede: "SyncRun은 크루와 혼자 뛰는 러너 모두를 위한 러닝 앱이에요. 옆 사람과 폰을 맞대면 그 자리에서 그룹이 되고, 함께 달린 기록은 카드 한 장으로 남아요.",
      note: "무료 · iPhone · iOS 18 이상",
      android: "Android 앱은 준비하고 있어요. 지금은 iPhone에서 쓸 수 있어요.",
      qr: "iPhone 카메라로 스캔해서 받기",
      altIdle: "혼자일 때의 앱 홈 화면. 지도 아래에 러닝 시작 버튼이 보인다",
      altPair: "폰을 맞댄 뒤의 앱 홈 화면. 두 사람이 그룹이 되고 버튼이 러닝 준비로 바뀌었다",
    },
    how: {
      title: "함께 뛰는 방법",
      steps: [
        {
          k: "폰을 맞대요",
          v: "함께 뛸 사람과 폰을 1m 안으로 가까이 대고 1초쯤 기다리면 그룹이 돼요.",
        },
        {
          k: "동시에 출발해요",
          v: "마지막 사람이 시작을 누르면 모두의 화면에 같은 3·2·1이 떠요.",
        },
        {
          k: "카드가 남아요",
          v: "다 뛰고 나면 각자의 경로가 겹친 기록 카드가 이미 만들어져 있어요.",
        },
      ],
    },
    together: {
      title: ["흩어져 달려도", "서로가 보여요."],
      lede: "방을 만들거나 친구를 추가하지 않아도 돼요. 달리는 동안 서로의 위치와 페이스가 한 화면에 보여요.",
      facts: [
        {
          k: "폰을 맞댄 사람만 들어와요",
          v: "200명이 뛰는 강변에서도 옆을 스쳐 가는 사람은 그룹에 들어오지 않아요.",
        },
        {
          k: "한 번 눌러 응원해요",
          v: "이름을 누르면 그 사람 손목에 하이파이브가 전해져요.",
        },
        {
          k: "위치는 같이 뛰는 사람에게만 보여요",
          v: "실시간 위치는 같은 세션의 러너에게 러닝 중에만 보이고 언제든 끌 수 있어요.",
        },
        {
          k: "마지막 사람이 들어오면 끝나요",
          v: "종료는 각자 하고, 모두 들어오면 합산 거리와 하이라이트가 완성돼요.",
        },
      ],
      alt: "러닝 중 화면. 거리와 평균 페이스 아래 지도에 함께 달리는 세 사람의 위치와 페이스가 보인다",
    },
    solo: {
      title: ["혼자 뛰는 날도", "기록은 빠짐없이."],
      lede: "아무와도 폰을 맞대지 않으면 같은 버튼으로 혼자 뛰기가 시작돼요. 모드를 따로 고를 필요가 없어요.",
      facts: [
        {
          k: "신호가 끊겨도 거리는 이어져요",
          v: "지하차도처럼 위치 신호가 약한 곳에서는 걸음 수로 거리를 이어 가요.",
        },
        {
          k: "음성 안내를 들으며 목표에 맞춰 달려요",
          v: "거리와 페이스, 심박을 음성으로 알려 주고 거리·시간·목표 페이스를 정해 달릴 수 있어요.",
        },
        {
          k: "Apple Watch만 차고 나가도 돼요",
          v: "폰 없이 달려도 경로와 심박, 1km 구간 기록이 똑같이 남아요.",
        },
        {
          k: "한 달이 달력에 쌓여요",
          v: "스트릭과 활동 통계로 그동안의 러닝을 보고, 한 달 달력을 이미지 한 장으로 공유해요.",
        },
      ],
    },
    card: {
      title: ["달린 기록을", "카드로 공유해요."],
      lede: "앱에서 바로 스토리나 사진으로 올릴 수 있어요. 사진을 깔고 템플릿을 바꾸거나 경로와 기록의 자리를 옮겨 꾸며도 돼요.",
      shotsLabel: "카드 예시",
      shots: [
        {
          caption: "함께 달린 경로를 담은 단체 카드",
          body: "같이 달린 사람들의 경로가 한 장에 나란히 모여요. 그날 찍은 사진을 깔면 기록이 사진 위에 얹혀요.",
          alt: "대릉원 앞에 선 네 사람 사진 위에 열 명의 경로와 평균 거리, 시간, 페이스를 담은 단체 카드",
        },
        {
          caption: "한 달의 러닝을 모은 달력 카드",
          body: "달린 날마다 그날의 사진과 경로가 달력 칸을 채워요. 몇 주째 이어 달리고 있는지도 함께 보여요.",
          alt: "9월 달력에 러닝 사진과 경로를 채운 카드. 7주 연속, 13일, 46.4km 기록",
        },
      ],
    },
    crew: {
      title: ["매주 같이 뛴다면", "크루를 만들어 보세요."],
      pains: [
        "“공지는 단톡방에 올리고, 출석은 손으로 체크해요.”",
        "“정기런 전날이면 누가 오는지 다시 물어봐요.”",
        "“한 달 동안 누가 얼마나 뛰었는지는 따로 정리해요.”",
      ],
      lede: "크루를 만들면 이 일을 앱이 대신해요. 그때그때 만들어지는 그룹과 달리 크루는 러닝이 끝나도 남아요.",
      facts: [
        {
          k: "출석은 자동으로",
          v: "크루원끼리 폰을 맞대고 뛰면 출석이 기록돼요. 따로 출석을 부를 필요가 없어요.",
        },
        {
          k: "정기런 알림은 앱이 대신",
          v: "전날 저녁과 시작 10분 전에 크루원 모두에게 알림이 가요.",
        },
        {
          k: "함께 쌓은 기록은 리캡으로",
          v: "한 달과 한 해의 합산 거리, 세션 수, 출석왕, 출석·거리 랭킹을 볼 수 있어요.",
        },
      ],
      note: "크루를 만들려면 Crew 플랜이 필요해요. 크루원으로 들어가는 데는 플랜이 없어도 돼요.",
    },
    reviews: {
      title: "먼저 뛰어 본 러너들의 이야기",
      rating: "5.0",
      count: "App Store 평점 · 평가 7개",
      asOf: "2026년 11월 기준",
      items: [
        {
          quote: "여러 명에서 뛸 때 폰 모으기만 하면 그룹이 만들어져서 진짜 편하네요.. 어떻게 이런 생각을 했지 ㄷㄷ",
          by: "마라톤중독 · 9월 15일",
        },
        { quote: "러닝 루트랑 기록 마음대로 편집할 수 있는게 좋네요", by: "가쟈가자 · 9월 14일" },
        { quote: "다른 사람들이랑 같이 러닝할 때 사용하기 좋을 것 같습니당", by: "뜗쁇쪈껽 · 9월 22일" },
      ],
    },
    plans: {
      title: "무료로 시작하세요.",
      lede: "측정과 기록, 함께 뛰기는 무료예요. 더 많은 사람과 뛰거나 기록을 더 자세히 보고 싶을 때 플랜을 고르면 돼요.",
      items: [
        {
          name: "무료",
          who: "처음 시작하는 러너에게",
          people: "6",
          peopleLabel: "명까지 함께",
          items: ["러닝 측정과 전체 기간 기록", "활동 통계와 함께 뛴 사람별 기록", "기본 카드와 사진·영상 공유"],
        },
        {
          name: "Plus",
          who: "혼자서도 꾸준히 뛰는 러너에게",
          people: "10",
          peopleLabel: "명까지 함께",
          items: ["무료의 모든 기능", "유료 카드 템플릿 전체", "기록 상세 분석"],
        },
        {
          name: "Crew",
          who: "크루를 이끄는 사람과 큰 모임에",
          people: "30",
          peopleLabel: "명까지 함께",
          items: ["Plus의 모든 혜택", "크루 만들기와 관리", "정기런·출석·리캡"],
        },
      ],
      note: "인원은 나를 포함한 수예요. 그룹에서 한 사람만 구독해도 그 자리의 모두가 함께 뛸 수 있어요. 가격과 무료 체험은 App Store에서 확인하세요.",
    },
    faq: {
      title: "자주 묻는 질문",
      items: [
        {
          q: "같이 뛰는 사람도 앱이 있어야 하나요?",
          a: "네. 각자 앱을 설치하고 홈 화면을 연 채로 폰을 맞대면 돼요. 1m 안이면 인식하고, 친구 추가는 필요 없어요.",
        },
        {
          q: "어떤 iPhone에서 되나요?",
          a: "iOS 18 이상에서 쓸 수 있어요. 폰 맞대기는 UWB 칩이 있는 iPhone 11 이후 모델(SE 제외)에서 돼요.",
        },
        {
          q: "Android에서도 쓸 수 있나요?",
          a: "지금은 iPhone에서만 쓸 수 있어요. Android 앱은 준비하고 있어요.",
        },
        {
          q: "Apple Watch가 꼭 있어야 하나요?",
          a: "아니요. 폰만 있어도 뛸 수 있어요. 워치가 있으면 심박도 같이 기록되고, 폰 없이 워치만 차고 달릴 수도 있어요.",
        },
        {
          q: "공유한 카드에 집 위치가 드러나지 않나요?",
          a: "기본 카드에는 지도 없이 경로 모양만 남아요. 지도는 직접 고를 때만 들어가고, 장소는 동 단위까지만 적혀요.",
        },
      ],
      more: "더 궁금한 점은 지원 페이지에서",
    },
    closing: {
      title: ["오늘 저녁,", "한 줄 긋고 오세요."],
      lede: "App Store에서 무료로 받을 수 있어요. iPhone · iOS 18 이상.",
      help: "도움이 필요하면",
    },
  },

  en: {
    nav: [
      { label: "Run together", href: "#together" },
      { label: "Run solo", href: "#solo" },
      { label: "Crew", href: "#crew" },
      { label: "Run cards", href: "#card" },
      { label: "Plans", href: "#plans" },
    ],
    store: "Download on the App Store",
    hero: {
      title: ["Bring your phones", "together, and run", "as a group."],
      lede: "Hold your phone close to the person next to you and you're a group on the spot. The run you share becomes a single card, and on solo days the same button starts your run.",
      note: "Free · iPhone · iOS 18 or later",
      android: "The Android app is on its way. For now, SyncRun is on iPhone.",
      qr: "Scan with your iPhone camera",
      altIdle: "The app home when alone, with a start button below the map",
      altPair: "The app home after bringing phones together, with two runners grouped and a ready button",
    },
    how: {
      title: "Three steps. That's it.",
      steps: [
        {
          k: "Bring your phones together",
          v: "Hold phones within 1 m for about a second and you're a group.",
        },
        {
          k: "Start at the same moment",
          v: "When the last person taps start, everyone's screen counts down 3·2·1 together.",
        },
        {
          k: "Keep the card",
          v: "When you finish, a card with everyone's overlapping routes is already made.",
        },
      ],
    },
    together: {
      title: ["Spread out,", "and still see each other."],
      lede: "No rooms to create, no friends to add. While you run, everyone's position and pace stay on one screen.",
      facts: [
        {
          k: "Only the phones you gather join",
          v: "Even on a riverside with 200 runners, phones passing by stay out.",
        },
        {
          k: "Cheer with one tap",
          v: "Tap a name and a high five lands on that runner's wrist.",
        },
        {
          k: "Location stays in the group",
          v: "Live location is visible only to runners in your session, only during the run, and you can turn it off anytime.",
        },
        {
          k: "Finish together",
          v: "Each runner ends on their own. When the last one is in, the total and highlights are complete.",
        },
      ],
      alt: "The running screen. Below distance and average pace, a map shows three runners and their paces",
    },
    solo: {
      title: ["On solo days,", "every step still counts."],
      lede: "If you haven't gathered with anyone, the same button simply starts your solo run. There are no modes to choose.",
      facts: [
        {
          k: "Distance survives lost signal",
          v: "Where location is weak, like an underpass, your steps carry the distance.",
        },
        {
          k: "Listen, and run to a goal",
          v: "Hear distance, pace, and heart rate by voice, and set a distance, time, or pace goal.",
        },
        {
          k: "Leave the phone, keep the watch",
          v: "With just Apple Watch, your route, heart rate, and 1 km splits are recorded the same way.",
        },
        {
          k: "A month becomes a calendar",
          v: "See your streak and activity stats, then share the month as one image.",
        },
      ],
    },
    card: {
      title: ["When you finish,", "the card is already there."],
      lede: "Create a card right in the app and share it as a story or photo. Add a photo, switch templates, and move your route and stats around.",
      shotsLabel: "Card examples",
      shots: [
        {
          caption: "A group card with everyone's routes",
          body: "Everyone's route lines up on a single card. Put a photo from the day underneath and your stats sit on top.",
          alt: "A photo of four people standing at the Daereungwon tombs, with ten runners' routes, average distance, time, and pace",
        },
        {
          caption: "A calendar card of a month of runs",
          body: "Each day you ran fills its square with that day's photo and route, along with how many weeks in a row you've kept going.",
          alt: "A September calendar with run photos and routes, showing 7 weeks on, 13 days, and 46.4 km",
        },
      ],
    },
    crew: {
      title: ["Run together every week?", "Make it a crew."],
      pains: [
        "“I post notices in the group chat and check attendance by hand.”",
        "“The night before every regular run, I ask again who's coming.”",
        "“I keep my own tally of who ran how much each month.”",
      ],
      lede: "With a crew, the app does this for you. Unlike a group formed on the spot, a crew stays after the run.",
      facts: [
        {
          k: "Attendance takes care of itself",
          v: "When crew members gather and run, attendance is recorded. No roll call needed.",
        },
        {
          k: "Reminders for regular runs",
          v: "Everyone gets a notification the evening before and 10 minutes before the start.",
        },
        {
          k: "Recaps of what you built",
          v: "See monthly and yearly totals, sessions, top attendee, and attendance and distance rankings.",
        },
      ],
      note: "Creating a crew is part of the Crew plan. Joining a crew doesn't require a plan.",
    },
    reviews: {
      title: "What early runners say",
      rating: "5.0",
      count: "App Store rating · 7 ratings",
      asOf: "As of November 2026",
      items: [
        {
          quote: "When several of us run, just bringing our phones together makes a group. So convenient. How did they even think of this?",
          by: "마라톤중독 · Sep 15",
        },
        { quote: "I like that I can edit my route and stats however I want.", by: "가쟈가자 · Sep 14" },
        { quote: "Looks great for running with other people.", by: "뜗쁇쪈껽 · Sep 22" },
      ],
      note: "Translated from reviews on the Korean App Store.",
    },
    plans: {
      title: "Start for free.",
      lede: "Tracking, records, and running together are free. Choose a plan when you want to run with more people or look deeper into your runs.",
      items: [
        {
          name: "Free",
          who: "For runners getting started",
          people: "6",
          peopleLabel: "runners together",
          items: ["Run tracking and your full history", "Activity stats and records by runner", "Standard cards, photo and video sharing"],
        },
        {
          name: "Plus",
          who: "For individual runners",
          people: "10",
          peopleLabel: "runners together",
          items: ["Everything in Free", "All paid card templates", "Detailed run analysis"],
        },
        {
          name: "Crew",
          who: "For crew leaders and large groups",
          people: "30",
          peopleLabel: "runners together",
          items: ["Everything in Plus", "Create and manage a crew", "Regular runs, attendance, recaps"],
        },
      ],
      note: "Counts include you. One subscriber is enough for everyone in the group. Prices and free trials are shown on the App Store.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "Does everyone need the app?",
          a: "Yes. Each runner installs the app, opens the home screen, and brings their phone within 1 m. No friend requests needed.",
        },
        {
          q: "Which iPhones are supported?",
          a: "iOS 18 or later. Bringing phones together works on iPhones with a UWB chip: iPhone 11 and later, excluding SE.",
        },
        {
          q: "Is SyncRun on Android?",
          a: "SyncRun is available on iPhone for now. The Android app is on its way.",
        },
        {
          q: "Do I need an Apple Watch?",
          a: "No. Your phone is enough. With a watch you also record heart rate and can run solo without your phone.",
        },
        {
          q: "Will a shared card reveal where I live?",
          a: "The default card shows only the route's shape, with no map. A map appears only if you choose it, and places are named at the neighborhood level.",
        },
      ],
      more: "More answers on the support page",
    },
    closing: {
      title: ["This evening,", "go draw a line."],
      lede: "Free on the App Store. iPhone · iOS 18 or later.",
      help: "Need help?",
    },
  },
};
