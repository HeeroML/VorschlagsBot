import { Bot, GrammyError, HttpError, session, webhookCallback} from "grammy";
import { run } from "@grammyjs/runner";
import env from "../env.js";
import handlers from "./handlers/index.js";
import type { MyContext, SessionData } from "./types/bot.js";
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
    console.error(
      "Unknown error:",
      e,
      "\n CTX: ",
      ctx,
      "\n\nCTX.Chat: ",
      JSON.stringify(ctx.myChatMember?.chat),
      "\n\nCTX.from: ",
      JSON.stringify(ctx.myChatMember?.from)
    );
  }
});

const domain = String(process.env.DOMAIN);
const secretPath = String(process.env.BOT_TOKEN);
const app = express();



export default async () => {
  app.use(express.json());
app.use(`/${secretPath}`, webhookCallback(bot, "express"));

app.listen(Number(process.env.PORT), async () => {
  // Make sure it is `https` not `http`!
  await bot.api.setWebhook(`https://${domain}/${secretPath}`);
});
bot.start()
};
