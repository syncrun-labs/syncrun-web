import { useCallback, useRef, type CSSProperties } from "react";
import gather from "@/public/scenes/gather.jpg";
import gatherSeq from "@/public/scenes/gather/manifest.json";
import ScrubFrames from "./ScrubFrames";
import { scrubbers } from "./scrub";
import { useLang } from "../../i18n/lang";
import { useProgress } from "../../lib/useProgress";

/**
 * 모으기 — 스크롤하는 만큼 네 손이 가장자리에서 들어와 가운데에 멈추고, 멈춘 뒤 폰이 한 대씩 켜진다.
 *
 * 영상이 끝나면(SETTLED) 원본 사진으로 넘어가고 그 위에 앱 홈을 얹는다. 합성은 두 겹으로 사진에 붙인다:
 *  1) 사진의 검은 화면 모양을 그대로 딴 마스크(`gather-screens.png`)로 잘라 베젤 밖으로 한 픽셀도 나가지 않고
 *  2) 사진과 같은 필름 입자·플래시 광량을 덮어 화면만 따로 떠 보이지 않는다.
 * 화면이 켜지는 순간은 불이 들어오듯 밝아진다(튀어나오거나 커지지 않는다).
 */

/** 사진의 네 화면. 0번이 나 — 카메라에 가장 가까운 폰. `rot`은 화면 위쪽(카메라 쪽)이 향하는 방향. 마스크가 가장자리를 자르므로 조금 크게 둔다 */
const SCREENS = [
  { cx: 55.4, cy: 80.4, w: 17, h: 35, rot: -8 },
  { cx: 46.9, cy: 23.8, w: 17.4, h: 35.6, rot: -13.3 },
  { cx: 81.3, cy: 45.0, w: 16.4, h: 33.6, rot: -101 },
  { cx: 18.9, cy: 58.1, w: 16.6, h: 34.6, rot: 77.8 },
] as const;

const SETTLED = 0.42; // 손이 멈추는 진행도
const JOIN = [SETTLED, 0.52, 0.6, 0.68] as const; // 한 대씩 켜지는 진행도

export default function Gather() {
  const { t } = useLang();
  const g = t.gather;
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback((p: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    scrubbers.get(stage)?.(p);
    const n = JOIN.filter((a) => p >= a).length;
    const count = String(Math.max(1, n));
    if (stage.dataset.on !== String(n)) {
      stage.dataset.on = String(n);
      const el = countRef.current;
      if (el && el.textContent !== count) {
        el.textContent = count;
        // 숫자가 바뀔 때마다 한 번 튄다
        el.classList.remove("is-kick");
        void el.offsetWidth;
        el.classList.add("is-kick");
      }
    }
  }, []);
  useProgress(ref, "pin", onFrame);

  return (
    <section className="gather" id="gather" data-chapter="1">
      <div className="gather__track" ref={ref}>
        <div className="gather__stage" ref={stageRef} data-scrub-host data-on="0">
          <div className="gather__copy container">
            <h2 className="h2">
              <span className="line">{g.title[0]}</span>
              <span className="line line--accent">{g.title[1]}</span>
            </h2>
            <p className="lede gather__lede">{g.lede}</p>
            <p className="gather__count">
              <span className="gather__count-n num" ref={countRef}>
                1
              </span>
              <span className="gather__count-label">{g.countLabel}</span>
            </p>
          </div>

          <figure className="gather__shot">
            <ScrubFrames
              name="gather"
              frames={gatherSeq.frames}
              from={0.04}
              to={SETTLED}
              settle
              poster={gather}
              alt={g.photoAlt}
              sizes="(max-width: 860px) 100vw, 56vw"
            />
            <div className="gather__screens" aria-hidden="true">
              {SCREENS.map((s, i) => (
                <div
                  key={i}
                  className="gather__screen"
                  data-i={i}
                  style={
                    {
                      left: `${s.cx}%`,
                      top: `${s.cy}%`,
                      width: `${s.w}%`,
                      height: `${s.h}%`,
                      "--rot": `${s.rot}deg`,
                    } as CSSProperties
                  }
                >
                  <PhoneHome btnSolo={g.btnSolo} btnReady={g.btnReady} names={t.crew} />
                </div>
              ))}
            </div>
            <div className="grain" aria-hidden="true" />
          </figure>
        </div>
      </div>

      <ul className="gather__facts container">
        {g.facts.map((f) => (
          <li key={f.k}>
            <strong>{f.k}</strong>
            <span>{f.v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * 홈 화면의 아래쪽 — 참가자 캡슐과 주 버튼. 앱과 같은 규칙이다:
 * 캡슐에는 연결 전에도 내가 있고 모일 때마다 옆으로 붙는다, 혼자면 [러닝 시작], 모이면 인원 뱃지와 [준비].
 * 인원은 무대의 `[data-on]`이 CSS로 정한다 — 켜진 화면들이 같은 순간에 같은 숫자를 보인다.
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
