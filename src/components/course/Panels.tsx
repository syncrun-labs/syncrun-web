import { useRef, type CSSProperties, type RefObject } from "react";
import Image from "next/image";
import river from "@/public/scenes/river.jpg";
import gather from "@/public/scenes/gather.jpg";
import start from "@/public/scenes/start.jpg";
import wrist from "@/public/scenes/wrist.jpg";
import tunnel from "@/public/scenes/tunnel.jpg";
import after from "@/public/scenes/after.jpg";
import curve from "@/public/scenes/curve.jpg";
import AppleGlyph from "../scenes/AppleGlyph";
import RunCardArt from "../scenes/RunCardArt";
import { CREW_KM, CREW_ON_LIGHT } from "../scenes/crew";
import { useLang } from "../../i18n/lang";
import { APP_STORE_URL } from "../../lib/app-store";

/**
 * 코스의 패널들 — 왼쪽에서 오른쪽으로 한 번의 러닝 순서다.
 * 출발 전(밤 강변) → 모으기(글 · 사진) → 3·2·1 → 출발선 → 함께(밝은 바탕) → 터널 → 카드(밝은 바탕) → 오늘 저녁.
 *
 * 사진 속 꺼진 화면의 자리·각도는 사진을 재서 얻은 값이다(사진 가로·세로에 대한 %).
 * 각 패널에는 코스가 `--lp`(0~1)를 흘려 준다.
 */

/** 모으기 사진의 네 화면. 0번이 나 — 카메라에 가장 가까운 폰. `rot`은 화면 위쪽(카메라 쪽)이 향하는 방향 */
const SCREENS = [
  { cx: 55.4, cy: 80.4, w: 15.6, h: 32.4, rot: -8 },
  { cx: 46.9, cy: 23.8, w: 16.0, h: 33.2, rot: -13.3 },
  { cx: 81.3, cy: 45.0, w: 15.0, h: 31.0, rot: -101 },
  { cx: 18.9, cy: 58.1, w: 15.2, h: 32.2, rot: 77.8 },
] as const;

/** 러닝 직후 사진 속 폰 화면 */
const AFTER_PHONE = { cx: 72.4, cy: 52.7, w: 33.5, h: 56.3, rot: 12.1 } as const;

const place = (s: { cx: number; cy: number; w: number; h: number; rot: number }) =>
  ({
    left: `${s.cx}%`,
    top: `${s.cy}%`,
    width: `${s.w}%`,
    height: `${s.h}%`,
    "--rot": `${s.rot}deg`,
  }) as CSSProperties;

export function Panels({
  countRef,
  tunnelKmRef,
}: {
  countRef: RefObject<HTMLSpanElement | null>;
  tunnelKmRef: RefObject<HTMLSpanElement | null>;
}) {
  const { t, base } = useLang();
  const cardRef = useRef<HTMLDivElement>(null);
  const art = {
    date: t.card.date,
    together: t.card.together,
    pace: t.card.pace,
    runners: t.card.runners,
    names: t.crew,
  };

  const replay = () => {
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove("is-replay");
    void el.offsetWidth; // 애니메이션을 처음부터 다시 걸기 위해 스타일을 한 번 확정한다
    el.classList.add("is-replay");
  };

  return (
    <>
      {/* ── 출발 전 ─────────────────────────────── */}
      <section className="pnl pnl--hero pnl--photo" data-panel="hero" id="top">
        <div className="pnl__parallax">
          <Image src={river} alt={t.hero.photoAlt} fill priority sizes="130vw" className="pnl__img" />
        </div>
        <div className="pnl__shade" aria-hidden="true" />
        <div className="pnl__copy hero__copy">
          <h1 className="display hero__title">
            <span className="line">{t.hero.title[0]}</span>
            <span className="line line--accent">{t.hero.title[1]}</span>
          </h1>
          <p className="lede hero__lede">{t.hero.lede}</p>
          <div className="hero__actions">
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
              <AppleGlyph />
              {t.hero.ctaPrimary}
            </a>
          </div>
          <p className="hero__hint" aria-hidden="true">
            {t.dock.walk}
            <span className="hero__arrow">→</span>
          </p>
        </div>
      </section>

      {/* ── 모으기: 글 ─────────────────────────── */}
      <section className="pnl pnl--gtext" data-panel="gtext" id="gather">
        <div className="pnl__copy gtext__copy">
          <h2 className="h2">
            <span className="line">{t.gather.title[0]}</span>
            <span className="line line--accent">{t.gather.title[1]}</span>
          </h2>
          <p className="lede gtext__lede">{t.gather.lede}</p>
          <p className="gtext__count">
            <span className="gtext__count-n num" ref={countRef}>
              1
            </span>
            <span className="gtext__count-label">{t.gather.countLabel}</span>
          </p>
          <ul className="gtext__facts">
            {t.gather.facts.map((f) => (
              <li key={f.k}>
                <strong>{f.k}</strong> {f.v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 모으기: 사진 ───────────────────────── */}
      <section className="pnl pnl--gphoto" data-panel="gphoto" data-count="1">
        <Image src={gather} alt={t.gather.photoAlt} fill sizes="100vh" className="pnl__img gphoto__img" />
        {SCREENS.map((s, i) => (
          <div key={i} className="gphoto__screen" data-i={i} style={place(s)} aria-hidden="true">
            <PhoneHome btnSolo={t.gather.btnSolo} btnReady={t.gather.btnReady} names={t.crew} />
          </div>
        ))}
      </section>

      {/* ── 3 · 2 · 1 ──────────────────────────── */}
      <section className="pnl pnl--count" data-panel="count" id="start" aria-label={t.start.title}>
        {["3", "2", "1"].map((n) => (
          <span key={n} className="count__n num" aria-hidden="true">
            {n}
          </span>
        ))}
      </section>

      {/* ── 출발선 ─────────────────────────────── */}
      <section className="pnl pnl--sphoto pnl--photo" data-panel="sphoto">
        <div className="pnl__parallax">
          <Image src={start} alt={t.start.photoAlt} fill sizes="130vw" className="pnl__img" />
        </div>
        <div className="pnl__shade" aria-hidden="true" />
        <div className="pnl__copy sphoto__copy">
          <h2 className="h2">{t.start.title}</h2>
          <p className="lede sphoto__lede">{t.start.lede}</p>
        </div>
      </section>

      {/* ── 함께 ──────────────────────────────── */}
      <section className="pnl pnl--together pnl--light" data-panel="together">
        <div className="pnl__copy together__copy">
          <h2 className="h2">
            <span className="line">{t.together.title[0]}</span>
            <span className="line">{t.together.title[1]}</span>
          </h2>
          <p className="lede together__lede">{t.together.lede}</p>
          <ol className="together__legend">
            {t.crew.map((n, i) => (
              <li key={n} style={{ "--c": CREW_ON_LIGHT[i] } as CSSProperties}>
                <span className="together__who">{n}</span>
                <span className="num">{CREW_KM[i].toFixed(2)} km</span>
              </li>
            ))}
          </ol>
        </div>
        <figure className="together__shot">
          <Image src={wrist} alt={t.together.photoAlt} fill sizes="50vw" className="pnl__img" />
          <div className="watch" aria-hidden="true">
            <div className="watch__face">
              <div className="watch__cheer" style={{ "--c": CREW_ON_LIGHT[2] } as CSSProperties}>
                <span className="watch__dot" />
                <span className="watch__who">{t.crew[2]}</span>
                <span className="watch__what">{t.together.cheer}</span>
                <span className="watch__sub">{t.together.cheerSub}</span>
              </div>
              <div className="watch__km num">
                {CREW_KM[3].toFixed(2)}
                <small>km</small>
              </div>
              <div className="watch__pace num">6&apos;02&quot;</div>
            </div>
          </div>
        </figure>
      </section>

      {/* ── 터널 ──────────────────────────────── */}
      <section className="pnl pnl--tunnel pnl--photo" data-panel="tunnel" data-mode="gps">
        <div className="pnl__parallax">
          <Image src={tunnel} alt={t.tunnel.photoAlt} fill sizes="130vw" className="pnl__img" />
        </div>
        <div className="pnl__shade" aria-hidden="true" />
        <div className="pnl__copy tunnel__copy">
          <h2 className="h2">
            <span className="line">{t.tunnel.title[0]}</span>
            <span className="line line--accent">{t.tunnel.title[1]}</span>
          </h2>
          <p className="lede tunnel__lede">{t.tunnel.lede}</p>
          <p className="tunnel__hud">
            <span className="tunnel__km num">
              <span ref={tunnelKmRef}>0.00</span>
              <small>km</small>
            </span>
            <span className="tunnel__mode tunnel__mode--gps">{t.tunnel.gps}</span>
            <span className="tunnel__mode tunnel__mode--steps">{t.tunnel.steps}</span>
          </p>
        </div>
      </section>

      {/* ── 카드 ──────────────────────────────── */}
      <section className="pnl pnl--card pnl--light" data-panel="card" id="card">
        <div className="pnl__copy card__copy">
          <h2 className="h2">
            <span className="line">{t.card.title[0]}</span>
            <span className="line">{t.card.title[1]}</span>
          </h2>
          <p className="lede card__lede">{t.card.lede}</p>
          <ol className="card__facts">
            {t.card.facts.map((f, i) => (
              <li key={f.k}>
                <span className="card__fact-n num">{i + 1}</span>
                <span>
                  <strong>{f.k}</strong> {f.v}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="card__stage">
          <div className="card__art" ref={cardRef} role="img" aria-label={t.card.cardAlt}>
            <RunCardArt {...art} />
          </div>
          <button type="button" className="card__replay" onClick={replay}>
            {t.card.replay}
          </button>
        </div>
        <figure className="card__shot">
          <Image src={after} alt={t.card.photoAlt} fill sizes="30vw" className="pnl__img" />
          <div className="card__phone" style={place(AFTER_PHONE)} aria-hidden="true">
            <RunCardArt {...art} still />
          </div>
        </figure>
      </section>

      {/* ── 오늘 저녁 ─────────────────────────── */}
      <section className="pnl pnl--cta pnl--photo" data-panel="cta" id="cta">
        <div className="pnl__parallax">
          <Image src={curve} alt="" fill sizes="130vw" className="pnl__img" />
        </div>
        <div className="pnl__shade" aria-hidden="true" />
        <svg className="cta__line" viewBox="0 0 1000 562.5" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M640 600 C636 490 618 410 572 352 S468 284 392 256" pathLength={1} className="cta__path" />
        </svg>
        <div className="pnl__copy cta__copy">
          <h2 className="h2">
            <span className="line">{t.cta.title[0]}</span>
            <span className="line line--accent">{t.cta.title[1]}</span>
          </h2>
          <p className="lede cta__lede">{t.cta.lede}</p>
          <div className="hero__actions">
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
              <AppleGlyph />
              {t.cta.ctaPrimary}
            </a>
            <a href={`${base}/support`} className="btn btn-ghost">
              {t.cta.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * 홈 화면의 아래쪽 — 참가자 캡슐과 주 버튼. 앱과 같은 규칙이다:
 * 캡슐에는 연결 전에도 내가 있고 모일 때마다 옆으로 붙는다, 혼자면 [러닝 시작], 모이면 인원 뱃지와 [준비].
 * 인원은 패널의 `[data-count]`가 CSS로 정한다 — 네 화면이 같은 순간에 같은 숫자를 보인다.
 */
function PhoneHome({ btnSolo, btnReady, names }: { btnSolo: string; btnReady: string; names: readonly string[] }) {
  return (
    <div className="phone-home">
      <div className="phone-home__map" />
      <div className="phone-home__capsule">
        {names.map((n, i) => (
          <span className="phone-home__avatar" data-i={i} key={n}>
            {n.slice(0, 1)}
          </span>
        ))}
      </div>
      <div className="phone-home__btn">
        <span className="phone-home__solo">{btnSolo}</span>
        <span className="phone-home__ready">
          <span className="phone-home__badge num" />
          {btnReady}
        </span>
      </div>
    </div>
  );
}
