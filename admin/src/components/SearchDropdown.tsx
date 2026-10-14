import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { MIN_SEARCH_LENGTH } from "../api/client";
import type { AdminUserDTO } from "../api/types";
import { formatDate } from "../lib/format";
import "./SearchDropdown.css";

const DEBOUNCE_MS = 250;
const STAGGER_MS = 50;

type Status = "idle" | "loading" | "done" | "error";

export interface SearchDropdownProps {
  search: (q: string, signal: AbortSignal) => Promise<AdminUserDTO[]>;
  onSelect: (user: AdminUserDTO) => void;
  placeholder?: string;
  autoFocus?: boolean;
  /** 고른 뒤 입력을 비운다(시험 수신자처럼 여러 명을 차례로 고를 때). */
  clearOnSelect?: boolean;
}

/**
 * 유리 캡슐 검색창. 입력하면 바로 아래, 같은 유리 카드 안에 결과가 하나씩 떨어지듯 나타난다.
 * 앞선 요청은 취소해 늦게 온 결과가 새 결과를 덮지 않게 한다.
 */
export function SearchDropdown({
  search,
  onSelect,
  placeholder = "이름 · 이메일 · 사용자 ID로 찾기",
  autoFocus,
  clearOnSelect,
}: SearchDropdownProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminUserDTO[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [batch, setBatch] = useState(0);

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_SEARCH_LENGTH) {
      setStatus("idle");
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(() => {
      search(q, controller.signal).then(
        (found) => {
          if (controller.signal.aborted) return;
          setResults(found);
          setStatus("done");
          setActive(found.length > 0 ? 0 : -1);
          setBatch((n) => n + 1);
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          if (error instanceof DOMException && error.name === "AbortError") return;
          setResults([]);
          setStatus("error");
        },
      );
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, search]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const choose = (user: AdminUserDTO) => {
    onSelect(user);
    setOpen(false);
    if (clearOnSelect) setQuery("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && event.key === "ArrowDown") {
      setOpen(true);
      return;
    }
    if (status !== "done" || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      choose(results[active]);
    }
  };

  // 첫 ↓ 는 목록을 열고 첫 줄에 선다 — 결과가 오면 첫 줄이 이미 선택돼 있다.
  const showPanel = open && status !== "idle";

  return (
    <div className={`search glass glass-card${showPanel ? " is-open" : ""}`} ref={rootRef}>
      <div className="search-field">
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? `${listId}-${active}` : undefined}
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {status === "loading" && <span className="search-spinner" aria-label="찾는 중" />}
      </div>

      {showPanel && (
        <div className="search-panel">
          {status === "loading" && results.length === 0 && (
            <div className="search-skeletons" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="search-row glass-inset skeleton" />
              ))}
            </div>
          )}
          {status === "done" && results.length === 0 && <p className="search-empty">찾는 사람이 없어요</p>}
          {status === "error" && <p className="search-empty">검색하지 못했어요. 다시 시도해 주세요</p>}
          {results.length > 0 && status !== "error" && (
            <ul id={listId} role="listbox" className="search-list" key={batch}>
              {results.map((user, i) => (
                <li
                  key={user.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={`search-row glass-inset sr-drop${i === active ? " is-active" : ""}`}
                  style={{ animationDelay: `${i * STAGGER_MS}ms` }}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(user);
                  }}
                >
                  <span className="avatar" aria-hidden="true">
                    {user.name.trim().charAt(0)}
                  </span>
                  <span className="search-row-main">
                    <span className="search-row-name">{user.name}</span>
                    <span className="search-row-sub">
                      {user.emailMasked ?? "이메일 없음"} · {user.provider === "google" ? "Google" : "Apple"}
                    </span>
                  </span>
                  <span className="search-row-meta num">{formatDate(user.createdAt)} 가입</span>
                  <span className="search-row-go" aria-hidden="true">
                    안내 보내기 ›
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
