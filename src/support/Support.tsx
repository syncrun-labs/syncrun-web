const EMAIL = "sjsb4838@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("[SyncRun 문의]")}`;
const HOME = import.meta.env.BASE_URL;

const FAQ = [
  {
    q: "폰을 맞대도 그룹이 만들어지지 않아요",
    a: [
      "맞댐은 UWB(초광대역) 칩이 있는 iPhone끼리만 동작합니다. iPhone 11 이후 모델(SE 제외)이 여기 해당하고, 그 밖의 기기에서는 맞댐이 나타나지 않습니다.",
      "두 사람 모두 앱의 홈 화면에 있어야 하고, 두 기기를 20cm 안쪽으로 0.4초 정도 붙인 채 유지하면 자동으로 같은 세션에 들어갑니다. 흔들거나 부딪칠 필요는 없습니다.",
      "처음 맞댈 때 뜨는 '근처 기기'와 '로컬 네트워크' 권한을 모두 허용해야 합니다. 실수로 거절했다면 iOS 설정 > SyncRun에서 다시 켤 수 있습니다.",
      "카운트다운이 시작된 뒤에는 새로 합류할 수 없습니다. 출발 전 홈 화면에서 맞대 주세요.",
    ],
  },
  {
    q: "화면을 끄면 거리가 멈추거나 경로가 끊깁니다",
    a: [
      "위치 권한이 '앱을 사용하는 동안'으로 허용되어 있고 '정확한 위치'가 켜져 있어야 합니다. iOS 설정 > SyncRun > 위치에서 확인해 주세요.",
      "저전력 모드는 위치 갱신 주기를 늦춥니다. 긴 러닝에서는 꺼 두는 편이 정확합니다.",
      "지하 구간이나 고층 건물 사이에서는 GPS 신호 자체가 흔들려 경로가 튈 수 있습니다. 다시 열린 하늘 아래로 나오면 이어서 기록됩니다.",
    ],
  },
  {
    q: "심박수가 빈칸으로 나옵니다",
    a: [
      "심박수는 Apple Watch(watchOS 11 이상) 또는 심박 측정을 지원하는 이어폰이 연결돼 있을 때 기록됩니다.",
      "심박은 민감정보라 별도 동의를 받습니다. '나' 탭에서 건강정보 수집 동의를 켜고, 건강 앱의 SyncRun 읽기 권한도 허용해 주세요.",
    ],
  },
  {
    q: "러닝이 건강 앱에 저장되지 않아요",
    a: [
      "완료한 러닝은 건강 앱에 운동으로 저장됩니다. iOS 설정 > 건강 > 데이터 접근 및 기기 > SyncRun에서 쓰기 권한이 켜져 있는지 확인해 주세요.",
    ],
  },
  {
    q: "러닝 카드를 사진으로 저장할 수 없습니다",
    a: [
      "카드 이미지와 경로 리플레이 영상은 저장을 누르는 순간에만 사진 앱에 추가됩니다. 저장이 안 되면 iOS 설정 > SyncRun > 사진에서 '추가만' 이상으로 허용해 주세요.",
    ],
  },
  {
    q: "기록이 사라졌거나, 새 기기에서 예전 기록이 보이지 않습니다",
    a: [
      "기록은 기기에 먼저 저장되고 이어서 계정에 동기화됩니다. 네트워크가 끊겨 있었다면 앱을 다시 열었을 때 밀린 기록이 함께 올라갑니다.",
      "같은 계정으로 로그인하면 서버에 있는 기록을 다시 내려받습니다. 로그인 계정이 다르면 기록도 다릅니다 — Apple 로그인과 이메일 가입은 별개의 계정입니다.",
    ],
  },
  {
    q: "비밀번호를 잊었어요",
    a: [
      "앱 안에서 비밀번호를 직접 재설정하는 기능은 아직 준비 중입니다. 가입한 이메일 주소로 아래 지원 메일에 연락 주시면 계정 확인 후 도와드립니다.",
    ],
  },
  {
    q: "같이 뛰는 사람에게 내 위치를 보이고 싶지 않습니다",
    a: [
      "'나' 탭 설정에서 라이브 위치 공유를 끄면 세션 지도에 내 위치가 올라가지 않습니다. 러닝 중에도 언제든 끌 수 있습니다.",
      "경로 라인만 남기기, 장소를 동 단위로만 표기하기, 위치 수집 자체를 일시중지하기도 같은 설정에 있습니다.",
      "위치는 참가 중인 세션의 러너에게만 공유되며, 러닝이 끝나면 실시간 공유도 끝납니다.",
    ],
  },
  {
    q: "계정을 지우고 싶습니다",
    a: [
      "'나' 탭 > 계정 관리 > 회원 탈퇴에서 직접 삭제할 수 있습니다. 서버 계정과 모든 러닝 기록이 함께 지워지고 되돌릴 수 없습니다.",
      "로그아웃은 계정을 지우지 않고 이 기기에서만 나갑니다.",
    ],
  },
];

const PERMISSIONS = [
  {
    name: "위치 (앱을 사용하는 동안)",
    use: "경로와 거리를 측정합니다. 화면이 꺼져 있어도 러닝 중에는 계속 기록합니다.",
    off: "러닝을 기록할 수 없습니다",
  },
  {
    name: "근처 기기 (Nearby Interaction)",
    use: "폰을 맞댈 때 두 기기 사이의 정확한 거리를 잽니다. 맞대는 순간에만 씁니다.",
    off: "맞댐으로 그룹을 만들 수 없습니다",
  },
  {
    name: "로컬 네트워크",
    use: "맞댄 상대의 기기를 같은 네트워크에서 확인합니다.",
    off: "맞댐으로 그룹을 만들 수 없습니다",
  },
  {
    name: "동작 및 피트니스",
    use: "페이스와 케이던스를 계산합니다.",
    off: "케이던스가 표시되지 않습니다",
  },
  {
    name: "건강 (읽기)",
    use: "러닝 중 심박수를 읽어 기록에 함께 남깁니다.",
    off: "심박수 자리가 비워집니다",
  },
  {
    name: "건강 (쓰기)",
    use: "완료한 러닝을 건강 앱에 운동으로 저장합니다.",
    off: "건강 앱에 운동이 남지 않습니다",
  },
  {
    name: "사진 추가",
    use: "러닝 카드 이미지나 리플레이 영상을 저장할 때만 사진 앱에 추가합니다.",
    off: "카드를 사진으로 저장할 수 없습니다",
  },
  {
    name: "알림",
    use: "함께 뛰는 그룹과 세션 상태를 알려 줍니다.",
    off: "알림이 오지 않습니다",
  },
];

export default function Support() {
  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <svg viewBox="0 0 64 64" width="24" height="24" aria-hidden="true">
              <circle cx="32" cy="32" r="20" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.4" opacity="0.35" />
              <circle cx="32" cy="32" r="13" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.8" opacity="0.6" />
              <circle cx="32" cy="32" r="5.4" fill="var(--cobalt)" />
            </svg>
            <span>SyncRun</span>
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              홈
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
            <span className="eyebrow">Support</span>
            <h1 className="doc__title">지원</h1>
            <p className="lede doc__lede">
              맞대면 그 자리에서 함께 뛰는 러닝 앱, SyncRun. 자주 막히는 지점과 문의 방법을 이 한 페이지에 모았습니다.
            </p>
            <p className="doc__meta mono">
              iOS 18.0 이상 · Apple Watch는 watchOS 11.0 이상(선택) · 앱 버전 0.1.0
            </p>
          </section>

          <section className="glass doc__contact" id="contact">
            <div className="doc__contact-main">
              <span className="doc__label mono">문의</span>
              <a href={MAILTO} className="doc__email">
                {EMAIL}
              </a>
              <p className="doc__contact-note">
                한국어와 영어로 답변드리며, 보통 2~3 영업일 안에 회신합니다.
              </p>
            </div>
            <div className="doc__contact-side">
              <span className="doc__label mono">이렇게 적어 주시면 빠릅니다</span>
              <ul className="doc__list">
                <li>기기 모델 (예: iPhone 15 Pro)</li>
                <li>iOS 버전과 앱 버전</li>
                <li>문제가 생긴 시각과 화면</li>
                <li>혼자 달리던 중인지, 맞댐으로 함께 달리던 중인지</li>
              </ul>
            </div>
          </section>

          <section className="doc__section" id="faq">
            <h2 className="h2 doc__h2">자주 묻는 질문</h2>
            <div className="doc__faq">
              {FAQ.map((item, i) => (
                <article key={item.q} className="doc__qa">
                  <span className="doc__qa-num mono tabular">{String(i + 1).padStart(2, "0")}</span>
                  <div className="doc__qa-body">
                    <h3 className="doc__qa-q">{item.q}</h3>
                    {item.a.map((p) => (
                      <p key={p} className="doc__qa-a">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="doc__section" id="permissions">
            <h2 className="h2 doc__h2">권한 안내</h2>
            <p className="doc__section-lede">
              SyncRun이 요청하는 권한과, 허용하지 않았을 때 달라지는 점입니다. 모든 권한은 iOS 설정 &gt; SyncRun에서
              언제든 바꿀 수 있습니다.
            </p>
            <div className="doc__perms">
              {PERMISSIONS.map((p) => (
                <div key={p.name} className="doc__perm">
                  <span className="doc__perm-name">{p.name}</span>
                  <p className="doc__perm-use">{p.use}</p>
                  <span className="doc__perm-off mono">{p.off}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="doc__section" id="privacy">
            <h2 className="h2 doc__h2">계정과 개인정보</h2>
            <div className="doc__cols">
              <div>
                <h3 className="doc__h3">계정 삭제</h3>
                <p className="doc__p">
                  앱의 &lsquo;나&rsquo; 탭 &gt; 계정 관리 &gt; 회원 탈퇴에서 직접 삭제할 수 있습니다. 서버 계정과 모든
                  러닝 기록이 함께 지워지며 되돌릴 수 없습니다. 앱에 접근할 수 없는 상황이라면 지원 메일로 요청해
                  주세요.
                </p>
              </div>
              <div>
                <h3 className="doc__h3">약관과 처리방침</h3>
                <p className="doc__p">
                  이용약관, 개인정보 처리방침, 위치기반서비스 이용약관 전문은 앱 첫 실행의 동의 화면과 &lsquo;나&rsquo;
                  탭 &gt; 계정 관리에서 열람할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="doc__h3">위치와 건강정보</h3>
                <p className="doc__p">
                  실시간 위치는 참가 중인 세션의 러너에게만 공유되고 러닝이 끝나면 멈춥니다. 심박수는 별도 동의를 받은
                  경우에만 수집하며, 두 가지 모두 &lsquo;나&rsquo; 탭 설정에서 끌 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section className="doc__section doc__section--en" id="english">
            <h2 className="doc__h3">Support (English)</h2>
            <p className="doc__p">
              SyncRun is a running app for iPhone (iOS 18.0 or later; Apple Watch requires watchOS 11.0 or later). Touch
              two phones together to form a group run, then run together and keep the route as a single run card.
            </p>
            <p className="doc__p">
              For help with pairing, location and health permissions, sign-in, or deleting your account, email{" "}
              <a href={MAILTO} className="doc__inline-link">
                {EMAIL}
              </a>
              . We reply in English or Korean, usually within 2–3 business days. Please include your device model, iOS
              version, app version, and when the issue happened.
            </p>
            <p className="doc__p">
              You can delete your account and all of your run history at any time in the app: Me &gt; Account &gt; Delete
              account.
            </p>
          </section>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className="doc-foot__links">
            <a href={HOME}>홈</a>
            <a href={MAILTO}>문의</a>
            <a href="https://github.com/syncrun-labs" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
