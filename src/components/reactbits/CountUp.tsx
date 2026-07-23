import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * CountUp — React Bits 계열. 뷰포트 진입 시 0에서 목표값까지 ease-out으로 센다.
 * 러닝 수치라 tabular-nums 고정 폭.
 */

type Props = {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
};

export default function CountUp({
  to,
  from = 0,
  duration = 1.8,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = false,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const skip = useMemo(shouldSkipReveal, []);
  const [value, setValue] = useState(skip ? to : from);

  useEffect(() => {
    if (skip || !inView) return;
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration, skip]);

  const formatted = (() => {
    const fixed = value.toFixed(decimals);
    if (!separator) return fixed;
    const [int, dec] = fixed.split(".");
    const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec ? `${withSep}.${dec}` : withSep;
  })();

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
