export interface ReportForm {
  title: string;
  detail: string;
  reportedId: string;
  reporterId: string;
}

export interface BlockerForm {
  blockedId: string;
  blockerId: string;
}

export interface BlockerType {
  blocked_id: string;
  blocker_id: string;
  created_at: string;
}
