import { useCallback, useEffect, useState } from "react";
import type { AdminUserDTO } from "../api/types";
import { useApi } from "../auth/auth";
import { PillButton } from "../components/PillButton";
import { SearchDropdown } from "../components/SearchDropdown";
import { useToast } from "../components/Toast";

const MAX = 5;

export function TestRecipientsPage() {
  const api = useApi();
  const toast = useToast();
  const [list, setList] = useState<AdminUserDTO[] | null>(null);
  const [saved, setSaved] = useState<string>("[]");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getTestRecipients().then(
      (users) => {
        setList(users);
        setSaved(JSON.stringify(users.map((u) => u.id)));
      },
      () => toast("시험 수신자를 불러오지 못했어요", "error"),
    );
  }, [api, toast]);

  const search = useCallback((q: string, signal: AbortSignal) => api.searchUsers(q, signal), [api]);

  const add = (user: AdminUserDTO) => {
    setList((current) => {
      const now = current ?? [];
      if (now.some((u) => u.id === user.id)) return now;
      if (now.length >= MAX) {
        toast(`${MAX}명까지예요`, "error");
        return now;
      }
      return [...now, user];
    });
  };

  const dirty = list !== null && JSON.stringify(list.map((u) => u.id)) !== saved;

  const save = async () => {
    if (!list) return;
    setBusy(true);
    try {
      const users = await api.setTestRecipients(list.map((u) => u.id));
      setList(users);
      setSaved(JSON.stringify(users.map((u) => u.id)));
      toast("저장했어요");
    } catch {
      toast("저장하지 못했어요", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="recipients">
      <header className="page-head">
        <h1>시험 수신자</h1>
        <p>「나에게 시험 발송」을 누르면 여기 있는 계정으로만 가요. 내 앱 계정을 찾아 넣어 두세요. 최대 {MAX}명.</p>
      </header>
      <SearchDropdown search={search} onSelect={add} clearOnSelect placeholder="내 앱 계정 찾기" />
      <section className="glass glass-card panel">
        {list === null && <div className="row-skeleton glass-inset skeleton" />}
        {list?.length === 0 && <p className="empty">아직 없어요. 위에서 찾아 넣어 주세요.</p>}
        <ul className="recipient-list">
          {list?.map((user, i) => (
            <li key={user.id} className="recipient glass-inset sr-drop" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="avatar" aria-hidden="true">
                {user.name.charAt(0)}
              </span>
              <span className="recipient-main">
                <strong>{user.name}</strong>
                <small>
                  {user.emailMasked ?? "이메일 없음"} · {user.id}
                </small>
              </span>
              <PillButton variant="quiet" onClick={() => setList((l) => l?.filter((u) => u.id !== user.id) ?? l)}>
                빼기
              </PillButton>
            </li>
          ))}
        </ul>
        <div className="panel-foot">
          <PillButton onClick={save} loading={busy} disabled={!dirty}>
            저장
          </PillButton>
        </div>
      </section>
    </div>
  );
}
