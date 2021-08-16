import {Composer} from "grammy";
import {MyContext} from "../types/bot";

const composer = new Composer<MyContext>();

composer.callbackQuery("group.add", async (ctx) => {
  await ctx.deleteMessage();
  ctx.session.wizard = "group.add";
  ctx.session.step = 1;
  await ctx.reply(`<b>Sende mir jetzt den Link deiner Gruppe</>

Sende den Link in dem Format: 
<i>https://t.me/</>`, {
    parse_mode: "HTML",
  });
});
composer.callbackQuery("group.update", async (ctx) => {
  ctx.session.wizard = "group.update";
  ctx.session.step = 1;
  await ctx.deleteMessage();
  await ctx.reply(`<b>Sende mir jetzt den Link deiner Gruppe</>

Sende den Link in dem Format: 
<i>https://t.me/</>`, {
    parse_mode: "HTML",
  });
});
composer.callbackQuery("group.delete", async (ctx) => {
  await ctx.deleteMessage();
  ctx.session.wizard = "group.delete";
  ctx.session.step = 1;
  await ctx.reply(`<b>Sende mir jetzt den Link deiner Gruppe</>

Sende den Link in dem Format: 
<i>https://t.me/</>`, {
    parse_mode: "HTML",
  });
});

composer.on("callback_query").filter(
    // @ts-ignore
    (ctx) => (ctx.callbackQuery.data).includes("like."),
    async (ctx) => {
      console.log("Like Pressed:" + JSON.stringify(ctx.callbackQuery))
    });

export default composer;
