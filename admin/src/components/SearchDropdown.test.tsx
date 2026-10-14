import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminUserDTO } from "../api/types";
import { SearchDropdown } from "./SearchDropdown";

const user = (n: number, name: string): AdminUserDTO => ({
  id: `id-${n}`,
  name,
  emailMasked: `u${n}***@gmail.com`,
  provider: "apple",
  createdAt: "2026-08-01T00:00:00Z",
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function type(value: string) {
  fireEvent.change(screen.getByRole("combobox"), { target: { value } });
}

async function flush(ms = 250) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
  });
}

describe("SearchDropdown", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("두 글자보다 짧으면 검색하지 않는다", async () => {
    const search = vi.fn().mockResolvedValue([]);
    render(<SearchDropdown search={search} onSelect={vi.fn()} />);
    type("김");
    await flush();
    expect(search).not.toHaveBeenCalled();
  });

  it("250ms 안에 여러 번 치면 마지막 검색어로 한 번만 부른다", async () => {
    const search = vi.fn().mockResolvedValue([]);
    render(<SearchDropdown search={search} onSelect={vi.fn()} />);
    type("지");
    type("지훈");
    await flush(100);
    type("지훈이");
    await flush(250);
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith("지훈이", expect.any(AbortSignal));
  });

  it("결과가 검색창 바로 아래에 차례로 뜬다", async () => {
    const search = vi.fn().mockResolvedValue([user(1, "김지훈"), user(2, "이지훈")]);
    render(<SearchDropdown search={search} onSelect={vi.fn()} />);
    type("지훈");
    await flush();
    const options = screen.getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual([
      expect.stringContaining("김지훈"),
      expect.stringContaining("이지훈"),
    ]);
    expect(options[1]).toHaveStyle({ animationDelay: "50ms" });
  });

  it("늦게 온 앞 검색의 결과가 새 결과를 덮지 않는다", async () => {
    const first = deferred<AdminUserDTO[]>();
    const signals: AbortSignal[] = [];
    const search = vi
      .fn()
      .mockImplementationOnce((_q: string, signal: AbortSignal) => {
        signals.push(signal);
        return first.promise;
      })
      .mockResolvedValueOnce([user(2, "박지성")]);
    render(<SearchDropdown search={search} onSelect={vi.fn()} />);
    type("지훈");
    await flush();
    type("지성");
    await flush();
    expect(signals[0].aborted).toBe(true);
    first.resolve([user(1, "김지훈")]);
    await flush(0);
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([expect.stringContaining("박지성")]);
  });

  it("결과가 오면 첫 줄이 선택돼 있어 Enter 만으로 맨 위 사람을 고른다", async () => {
    const onSelect = vi.fn();
    const search = vi.fn().mockResolvedValue([user(1, "김지훈"), user(2, "이지훈")]);
    render(<SearchDropdown search={search} onSelect={onSelect} />);
    type("지훈");
    await flush();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ name: "김지훈" }));
  });

  it("↓ Enter 는 두 번째 사람을 고르고, 고르면 닫힌다", async () => {
    const onSelect = vi.fn();
    const search = vi.fn().mockResolvedValue([user(1, "김지훈"), user(2, "이지훈")]);
    render(<SearchDropdown search={search} onSelect={onSelect} />);
    type("지훈");
    await flush();
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ name: "이지훈" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("누르면 그 사람을 고른다", async () => {
    const onSelect = vi.fn();
    const search = vi.fn().mockResolvedValue([user(1, "김지훈")]);
    render(<SearchDropdown search={search} onSelect={onSelect} />);
    type("지훈");
    await flush();
    fireEvent.mouseDown(screen.getByRole("option"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "id-1" }));
  });

  it("Esc 는 목록을 닫는다", async () => {
    const search = vi.fn().mockResolvedValue([user(1, "김지훈")]);
    render(<SearchDropdown search={search} onSelect={vi.fn()} />);
    type("지훈");
    await flush();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("없으면 없다고, 실패하면 다시 시도하라고 알린다", async () => {
    const search = vi.fn().mockResolvedValueOnce([]).mockRejectedValueOnce(new Error("boom"));
    render(<SearchDropdown search={search} onSelect={vi.fn()} />);
    type("없는이름");
    await flush();
    expect(screen.getByText("찾는 사람이 없어요")).toBeInTheDocument();
    type("또없는이름");
    await flush();
    expect(screen.getByText("검색하지 못했어요. 다시 시도해 주세요")).toBeInTheDocument();
  });
});
