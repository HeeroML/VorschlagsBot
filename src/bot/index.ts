import { Bot, session } from "grammy";
import env from "../env";
import handlers from "./handlers";
import type { MyContext, SessionData } from "./types/bot";

const bot = new Bot<MyContext>(env.TOKEN);
bot.use(
  session({
    initial(): SessionData {
      return {
        page: 0,
        groupID: "",
        groupName: "string",
        message_id: 0,
        userID: 0,
        match: undefined,
        token: undefined,
        wizard: "start",
        step: 0,
        groupLink: "none",
        groupType: "none",
        categoryId: 100,
        groupDescription: "",
      };
    },
  })
);
bot.use(handlers);
bot.on("callback_query", async (ctx: MyContext) => {
  await ctx.deleteMessage();
  await ctx.answerCallbackQuery();
});

export default async () => await bot.start({ drop_pending_updates: true });
