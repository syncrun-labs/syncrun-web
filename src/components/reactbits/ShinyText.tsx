/**
 * ShinyText — React Bits 계열. 텍스트 위로 밝은 빛 띠가 천천히 지나간다.
 * 배경 클립 마스크 + shimmer 키프레임(index.css).
 */

type Props = {
  text: string;
  className?: string;
  speed?: number;
};

export default function ShinyText({ text, className = "", speed = 5 }: Props) {
  return (
    <span
      className={`shiny-text ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}
