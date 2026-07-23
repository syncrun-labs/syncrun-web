import AnimatedContent from "../reactbits/AnimatedContent";
import RouteArt from "../ui/RouteArt";
import GradientText from "../reactbits/GradientText";

const EDITS = ["내 경로만 · 전원 경로", "배경 · 템플릿", "표시 항목 · 규격", "한 번에 공유"];

export default function RunCard() {
  return (
    <section className="section card" id="card">
      <div className="container card__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="card__visual">
            <RouteArt />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="card__copy">
            <span className="eyebrow">루트 아트</span>
            <h2 className="h2">
              함께 뛴 경로가 <GradientText>한 장의 작품</GradientText>이 된다
            </h2>
            <p className="lede">
              러닝이 끝나면 카드는 이미 완성돼 있습니다. 개인·단체를 따로 만들지 않고 한 장만 남기며,
              내 경로만 또는 전원의 경로를 겹쳐 보여주도록 편집할 수 있습니다.
            </p>
            <ul className="card__edits">
              {EDITS.map((e) => (
                <li key={e} className="card__edit">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
