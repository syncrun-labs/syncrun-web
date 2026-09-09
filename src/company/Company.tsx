import { COMPANY } from "../lib/company";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";

const EMAIL = SUPPORT_EMAIL;
const MAILTO = supportMailto("[SyncRun 문의]");
const HOME = import.meta.env.BASE_URL;
const SUPPORT = `${HOME}support`;
const LEGAL = `${HOME}legal`;
const WORDMARK = `${HOME}brand/wordmark.png`;

/** 이용약관 제27조·위치기반서비스 이용약관 제16조가 적고 있는 값과 같은 표다. */
const BIZ: { k: string; v: string }[] = [
  { k: "상호", v: COMPANY.ko.legalName },
  { k: "대표자", v: COMPANY.ko.ceo },
  { k: "사업자등록번호", v: COMPANY.ko.bizNo },
  { k: "사업장 주소", v: `(${COMPANY.ko.postalCode}) ${COMPANY.ko.address}` },
  { k: "업태 · 종목", v: COMPANY.ko.industry },
  { k: "사업 형태", v: `${COMPANY.ko.form} · ${COMPANY.ko.founded} 설립` },
  { k: "문의", v: EMAIL },
];

const BIZ_EN: { k: string; v: string }[] = [
  { k: "Legal name", v: COMPANY.en.legalName },
  { k: "Representative", v: `${COMPANY.en.ceo}, ${COMPANY.en.ceoLabel}` },
  { k: "Business registration no.", v: COMPANY.en.bizNo },
  { k: "Registered address", v: `${COMPANY.en.address} ${COMPANY.en.postalCode}` },
  { k: "Industry", v: COMPANY.en.industry },
  { k: "Entity type", v: `${COMPANY.en.form} · Founded ${COMPANY.en.founded}` },
  { k: "Contact", v: EMAIL },
];

/** 확인 가능한 사실만 적는다 — 날짜가 붙지 않는 계획은 「다음」에 둔다. */
const MILESTONES: { when: string; what: string }[] = [
  { when: "2026.08", what: "TestFlight 내부 베타 시작 — 맞댐으로 그룹이 결성되고 함께 뛴 기록이 카드로 남는 전 흐름이 실기기에서 동작" },
  { when: "2026.08", what: "syncrunlabs.com 개설 · 이용약관 · 개인정보 처리방침 · 위치기반서비스 이용약관 게시" },
  { when: "2026.09", what: `개인사업자 등록 — ${COMPANY.ko.legalName}, 사업자등록번호 ${COMPANY.ko.bizNo}` },
  { when: "다음", what: "TestFlight 외부 베타 · 위치기반서비스사업 신고 · App Store 정식 출시" },
];

const STACK: { area: string; detail: string }[] = [
  {
    area: "iOS",
    detail: "SwiftUI · Nearby Interaction(UWB)로 맞댐 근접 판정 · Core Location과 Core Motion을 융합한 거리 측정 · HealthKit 심박 · watchOS 컴패니언 · 위젯",
  },
  {
    area: "서버",
    detail: "TypeScript · NestJS · Socket.IO 실시간 세션 · Prisma · Sign in with Apple · APNs 푸시",
  },
  {
    area: "인프라",
    detail: "Terraform으로 배포 상태를 코드로 관리 · GitHub Actions와 Xcode Cloud CI · 자체 도메인 뒤에 API를 두어 배포처를 갈아끼울 수 있게 유지",
  },
];

export default function Company() {
  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <img src={WORDMARK} alt="SyncRun" className="doc-nav__wordmark" />
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              홈
            </a>
            <a href={SUPPORT} className="doc-nav__link">
              지원
            </a>
            <a href={MAILTO} className="btn btn-primary doc-nav__cta">
              문의하기
            </a>
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <h1 className="doc__title">{COMPANY.ko.name}</h1>
            <p className="lede doc__lede">
              함께 뛰는 일을 앱이 방해하지 않게 만듭니다. 옆 사람과 폰을 맞대면 그 자리에서 그룹이 결성되고, 함께 뛴
              경로가 한 장의 러닝 카드로 남습니다.
            </p>
            <p className="doc__meta mono">
              {COMPANY.ko.form} · 대표 {COMPANY.ko.ceo} · 사업자등록번호 {COMPANY.ko.bizNo}
            </p>
          </section>

          <section className="doc__section" id="about">
            <h2 className="h2 doc__h2">무엇을 만드나</h2>
            <p className="doc__section-lede">
              SyncRun은 iPhone용 러닝 앱입니다. 혼자 뛰든 여럿이 뛰든 시작 버튼은 하나입니다.
            </p>
            <div className="doc__cols">
              <div>
                <h3 className="doc__h3">맞대면 그룹이 된다</h3>
                <p className="doc__p">
                  같이 뛰려면 보통 방을 만들고 링크를 보내고 상대가 들어오기를 기다립니다. SyncRun은 그 절차를 없앴습니다.
                  두 사람이 폰을 맞대면 초광대역(UWB) 근접 판정으로 서로를 확인하고 같은 세션에 들어갑니다. 이미 뛰고 있는
                  무리에 한 사람이 맞대면 그 무리 전체와 합쳐집니다.
                </p>
              </div>
              <div>
                <h3 className="doc__h3">뛰는 동안은 화면을 보지 않아도 된다</h3>
                <p className="doc__p">
                  같은 세션의 러너들은 서로의 위치와 페이스를 실시간으로 주고받습니다. 마지막 주자가 뒤처지면 앞선 러너에게
                  알림이 갑니다. 달리는 사람이 화면을 들여다보지 않아도 무리가 흩어지지 않게 하는 것이 목표입니다.
                </p>
              </div>
              <div>
                <h3 className="doc__h3">기록은 한 장으로 남는다</h3>
                <p className="doc__p">
                  러닝이 끝나면 경로·거리·페이스·함께 뛴 사람이 한 장의 러닝 카드가 됩니다. 카드는 지도 배경 없이 경로
                  라인만 그리고 장소는 동 단위로만 적습니다 — 공유하는 순간 집 위치가 드러나지 않게 하기 위한 기본값이고,
                  이 값은 낮출 수 없습니다.
                </p>
              </div>
            </div>
          </section>

          <section className="doc__section" id="status">
            <h2 className="h2 doc__h2">지금 어디까지 왔나</h2>
            <p className="doc__section-lede">
              현재 TestFlight 내부 베타 단계이며, 외부 베타를 거쳐 App Store 정식 출시를 준비하고 있습니다.
            </p>
            <div className="doc__faq doc__faq--milestones">
              {MILESTONES.map((m) => (
                <article key={m.when + m.what} className="doc__qa">
                  <span className="doc__qa-num mono tabular">{m.when}</span>
                  <div className="doc__qa-body">
                    <p className="doc__qa-a">{m.what}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="doc__section" id="stack">
            <h2 className="h2 doc__h2">어떻게 만드나</h2>
            <p className="doc__section-lede">
              팀은 소수이고, 그래서 사람이 기억해야 하는 것을 줄이는 데 시간을 씁니다. 제품 요구사항과 API 계약을 한 저장소에
              모아 두고, 앱·서버·인프라가 그 문서를 따릅니다.
            </p>
            <div className="doc__perms doc__perms--stack">
              {STACK.map((s) => (
                <div key={s.area} className="doc__perm">
                  <span className="doc__perm-name">{s.area}</span>
                  <p className="doc__perm-use">{s.detail}</p>
                </div>
              ))}
            </div>
            <p className="doc__p">
              저장소는{" "}
              <a href={COMPANY.github} className="doc__inline-link" target="_blank" rel="noreferrer">
                github.com/syncrun-labs
              </a>
              에 있습니다.
            </p>
          </section>

          <section className="doc__section" id="business">
            <h2 className="h2 doc__h2">사업자 정보</h2>
            <p className="doc__section-lede">
              아래 정보는 「서비스 이용약관」 제27조와 「위치기반서비스 이용약관」 제16조에 적힌 값과 같습니다.
            </p>
            <dl className="biz">
              {BIZ.map((row) => (
                <div key={row.k} className="biz__row">
                  <dt className="biz__k mono">{row.k}</dt>
                  <dd className="biz__v">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className="doc__p">
              서비스는 전부 무상으로 제공되어 통신판매업 신고 대상이 아닙니다. 위치기반서비스사업 신고는 준비 중이며, 신고번호를
              받는 대로{" "}
              <a href={`${LEGAL}#location`} className="doc__inline-link">
                위치기반서비스 이용약관
              </a>{" "}
              제16조에 기재하고 공지합니다.
            </p>
          </section>

          <section className="glass doc__contact" id="contact">
            <div className="doc__contact-main">
              <span className="doc__label mono">연락</span>
              <a href={MAILTO} className="doc__email">
                {EMAIL}
              </a>
              <p className="doc__contact-note">
                제휴·채용·취재 문의도 같은 주소로 받습니다. 보통 2~3 영업일 안에 회신합니다.
              </p>
            </div>
            <div className="doc__contact-side">
              <span className="doc__label mono">바로가기</span>
              <ul className="doc__list">
                <li>
                  <a href={HOME} className="doc__inline-link">
                    제품 소개
                  </a>
                </li>
                <li>
                  <a href={SUPPORT} className="doc__inline-link">
                    지원 · 도움말
                  </a>
                </li>
                <li>
                  <a href={LEGAL} className="doc__inline-link">
                    약관 및 정책
                  </a>
                </li>
                <li>
                  <a href={COMPANY.github} className="doc__inline-link" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section className="doc__section doc__section--en" id="english">
            <h2 className="doc__h3">About SyncRun Labs (English)</h2>
            <p className="doc__p">
              SyncRun Labs is a software company in Gyeongsan, Republic of Korea. We build <strong>SyncRun</strong>, an
              iPhone running app that removes the setup step from running together: two runners tap their phones, an
              ultra-wideband proximity check confirms they are face to face, and a shared session starts on the spot. One
              tap also merges a newcomer into a group that is already running.
            </p>
            <p className="doc__p">
              During a run, everyone in the session sees each other&rsquo;s live position and pace, and the leaders are
              notified when the last runner falls behind — so the group stays together without anyone staring at a screen.
              Each run is saved as a single run card that draws the route without a map background and names the place only
              down to the neighbourhood, so sharing it never reveals where someone lives.
            </p>
            <p className="doc__p">
              The app is in closed TestFlight beta and is being prepared for App Store release. It is built with SwiftUI,
              Nearby Interaction, HealthKit and Core Location on the client, and TypeScript, NestJS, Socket.IO and Prisma
              on the server, with infrastructure managed in Terraform.
            </p>
            <dl className="biz">
              {BIZ_EN.map((row) => (
                <div key={row.k} className="biz__row">
                  <dt className="biz__k mono">{row.k}</dt>
                  <dd className="biz__v">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className="doc__p">
              For partnerships, press or anything else, email{" "}
              <a href={MAILTO} className="doc__inline-link">
                {EMAIL}
              </a>
              . Our repositories are at{" "}
              <a href={COMPANY.github} className="doc__inline-link" target="_blank" rel="noreferrer">
                github.com/syncrun-labs
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 {COMPANY.en.name}</span>
          <div className="doc-foot__links">
            <a href={HOME}>홈</a>
            <a href={SUPPORT}>지원</a>
            <a href={LEGAL}>약관</a>
            <a href={MAILTO}>문의</a>
          </div>
        </div>
      </footer>
    </>
  );
}
