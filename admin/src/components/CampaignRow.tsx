import { Link } from "react-router";
import type { CampaignDTO, CampaignStatus } from "../api/types";
import { formatCount, formatDateTime } from "../lib/format";

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "작성 중",
  scheduled: "예약됨",
  sending: "보내는 중",
  sent: "보냄",
  canceled: "취소됨",
};

function when(campaign: CampaignDTO): string {
  if (campaign.status === "scheduled" && campaign.scheduledAt) return `${formatDateTime(campaign.scheduledAt)} 예정`;
  if (campaign.finishedAt) return formatDateTime(campaign.finishedAt);
  return formatDateTime(campaign.createdAt);
}

export function CampaignRow({ campaign, index }: { campaign: CampaignDTO; index: number }) {
  const { counts } = campaign;
  return (
    <li className="sr-drop" style={{ animationDelay: `${index * 40}ms` }}>
      <Link to={`/campaigns/${campaign.id}`} className="campaign-row glass-inset">
        <span className={`status status-${campaign.status}`}>{STATUS_LABEL[campaign.status]}</span>
        <span className="campaign-row-main">
          <span className="campaign-row-title">{campaign.titleKo}</span>
          <span className="campaign-row-sub">{when(campaign)}</span>
        </span>
        <span className="campaign-row-stats num">
          {campaign.status === "sent" || campaign.status === "sending" ? (
            <>
              <strong>{formatCount(counts.sent)}</strong> 보냄 · <strong>{formatCount(counts.opened)}</strong> 열람
            </>
          ) : (
            "—"
          )}
        </span>
      </Link>
    </li>
  );
}
