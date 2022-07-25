import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../types/bot.js";

const composer = new Composer<MyContext>();

composer.command("start", async (ctx) => {
  if (ctx.chat?.type != "private") {
    return await ctx.reply("Ich bin am Leben!");
  }
  ctx.session.wizard = "start";
  ctx.session.step = 1;
  return await ctx.reply(`Ich kann deine Gruppen verwalten für @gruppen!`, {
    reply_markup: new InlineKeyboard()
      .text("Gruppe hinzufügen", "group.add")
      .row()
      .text("Gruppe aktualisieren", "group.update")
      .row()
      .text("🔞Ü18 Gruppe hinzufügen", "group.add18"),
    //.text("Gruppe löschen", "group.delete"),
  });
});

export default composer;
