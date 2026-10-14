import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { CampaignDTO } from "../api/types";
import { useApi } from "../auth/auth";
import { CampaignRow } from "../components/CampaignRow";
import { PillButton } from "../components/PillButton";
import { SearchDropdown } from "../components/SearchDropdown";

export function HomePage() {
  const api = useApi();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignDTO[] | null>(null);
  const [failed, setFailed] = useState(false);

  const search = useCallback((q: string, signal: AbortSignal) => api.searchUsers(q, signal), [api]);

  useEffect(() => {
    let alive = true;
    api.listCampaigns().then(
      (page) => alive && setCampaigns(page.items),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, [api]);

  return (
    <div className="home">
      <section className="home-hero">
        <h1>누구에게 알릴까요?</h1>
        <p>사람을 찾아 바로 보내거나, 조건으로 골라 한꺼번에 보내요.</p>
        <div className="home-search">
          <SearchDropdown
            search={search}
            autoFocus
            onSelect={(user) => navigate(`/compose?to=${encodeURIComponent(user.id)}`)}
          />
        </div>
        <div className="home-actions">
          <PillButton onClick={() => navigate("/compose")}>조건으로 골라 보내기</PillButton>
        </div>
      </section>

      <section className="home-recent">
        <div className="section-head">
          <h2>최근 알림</h2>
        </div>
        <div className="glass glass-card list-card">
          {failed && <p className="empty">알림 목록을 불러오지 못했어요</p>}
          {!failed && campaigns === null && (
            <div className="list-skeleton">
              {[0, 1, 2].map((i) => (
                <div key={i} className="row-skeleton glass-inset skeleton" />
              ))}
            </div>
          )}
          {campaigns?.length === 0 && (
            <p className="empty">
              아직 보낸 알림이 없어요. <Link to="/compose">첫 안내 만들기</Link>
            </p>
          )}
          {campaigns && campaigns.length > 0 && (
            <ul className="campaign-list">
              {campaigns.map((campaign, i) => (
                <CampaignRow key={campaign.id} campaign={campaign} index={i} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
