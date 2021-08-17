import {Bot, GrammyError, HttpError, session} from "grammy";
import {run} from "@grammyjs/runner";
import env from "../env";
import handlers from "./handlers";
import type {MyContext, SessionData} from "./types/bot";
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

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e, "\n CTX: ", ctx, "\n\nCTX.Chat: ", JSON.stringify(ctx.myChatMember?.chat), "\n\nCTX.from: ", JSON.stringify(ctx.myChatMember?.from));
  }
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
  await bot.api.deleteWebhook({drop_pending_updates: true})
  run(bot)
};
