import CountUp from "../reactbits/CountUp";

const STATS = [
  { to: 20, suffix: "cm", decimals: 0, k: "맞댐 인식 거리" },
  { to: 0.4, suffix: "초", decimals: 1, k: "결성 확정 시간" },
  { to: 100, suffix: "%", decimals: 0, k: "GPS 실측 지표" },
  { to: 0, suffix: "", decimals: 0, k: "외부 런타임 의존성" },
];

export default function Stats() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s) => (
          <div key={s.k} className="stats__item">
            <span className="stats__value tabular">
              <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </span>
            <span className="stats__key">{s.k}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
