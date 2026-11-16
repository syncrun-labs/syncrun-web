import Link from "next/link";
import type { Route } from "next";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * 사이트 안의 페이지(`/`로 시작)는 `next/link`로 그린다. 같은 레이아웃 안에서는 문서를 다시 받지 않고 화면 안에서 넘어간다.
 * 미리 받기(prefetch)는 끈다. 방문자 대부분이 한 페이지만 보고 나가는 사이트라, 링크가 보일 때마다
 * 페이지당 67~106KiB(압축 전)를 받아 두면 대부분 버려진다. 누르는 순간 받아도 정적 페이로드라 금방이다.
 * 같은 페이지의 앵커와 mailto는 `<a>` 그대로, 바깥 주소(`http`)는 새 창으로 연다.
 */
export default function SiteLink({
  href,
  className,
  children,
  ...rest
}: {
  href: Route;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} prefetch={false} {...rest}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}
