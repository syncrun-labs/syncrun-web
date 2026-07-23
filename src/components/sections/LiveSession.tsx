import AnimatedContent from "../reactbits/AnimatedContent";
import LiveMap from "../ui/LiveMap";

const FACTS = [
  { k: "실시간 위치", v: "서로의 위치가 지도 위에서 함께 흐릅니다." },
  { k: "라이브 페이스", v: "동행자의 거리·페이스가 초 단위로 갱신됩니다." },
  { k: "끊겨도 이어달리기", v: "연결이 끊기면 재부착으로 세션과 기록을 그대로 복원합니다." },
];

export default function LiveSession() {
  return (
    <section className="section live" id="live">
      <div className="container live__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="live__visual">
            <LiveMap />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="live__copy">
            <span className="eyebrow">실시간 세션</span>
            <h2 className="h2">달리는 동안, 서로가 보인다</h2>
            <p className="lede">
              외부 실시간 라이브러리 없이 자체 구현한 Socket.IO 세션으로, 함께 뛰는 사람들의 현황이
              같은 순간 흐릅니다.
            </p>
            <dl className="live__facts">
              {FACTS.map((f) => (
                <div key={f.k} className="live__fact">
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
