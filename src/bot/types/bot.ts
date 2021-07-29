import type { Context as GrammyContext, SessionFlavor } from "grammy";

export interface SessionData {
  page?: number;
  groupID: string;
  groupName: string;
  message_id: number;
  userID: number;
  match: RegExpExecArray | undefined;
  token: string | undefined;
  wizard: "start" | "group.add" | "group.delete" | "group.update";
  step: number;
  groupLink: string;
  groupType: "Channel" | "Group" | "none";
  categoryId: number;
  groupDescription: string;
}

export type MyContext = GrammyContext &
  SessionFlavor<SessionData> &
  SessionData;
