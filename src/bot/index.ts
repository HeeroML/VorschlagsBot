import { Bot, session } from "grammy";
import env from "../env";
import handlers from "./handlers";
import type { MyContext, SessionData } from "./types/bot";
import express from "express";
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

export default async () => {
  const app = express();
  const port = "8080";
  app.get("/", (req, res) => {
    res.sendStatus(200);
  });
  app.listen(port, () => {
    console.log(`Health Check Working ${env.DOMAIN}:${port}`);
  });
  bot.start({ drop_pending_updates: true });
};
