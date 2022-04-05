import { Composer } from "grammy";
import { MyContext } from "../types/bot";

const composer = new Composer<MyContext>();

composer.on("callback_query:data").filter(
  (ctx) => ctx.session.step == 2,
  async (ctx) => {
    await ctx.answerCallbackQuery({ text: "Antwort erhalten" });
    if (ctx.callbackQuery.data.includes("channelAddAdmin.")) {
      await ctx.reply("Noch nicht implementiert!");
    } else if (ctx.callbackQuery.data.includes("channelAddAdmin.")) {
      await ctx.reply("Noch nicht implementiert bis jetzt!");
    }
  }
);

export default composer;
