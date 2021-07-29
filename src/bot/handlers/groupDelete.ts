import { Composer } from "grammy";
import isUrlExists from "url-exists-nodejs";
import { MyContext } from "../types/bot";
const composer = new Composer<MyContext>();

composer.on("message:text").filter(
  async (ctx) =>
    ctx.session.step == 1 &&
    !(
      (await isUrlExists(ctx.message.text.toString())) ||
      !ctx.message.text.toString().includes("t.me")
    ),
  async (ctx: MyContext) => {
    await ctx.reply(
      `<b>Dein Link ist nicht gültig</>
      Sende den Link in dem Format: <i>https:t.me/</>`,
      {
        parse_mode: "HTML",
      }
    );
  }
);

composer.on("message:text").filter(
  async (ctx) =>
    ctx.session.step == 1 &&
    (await isUrlExists(ctx.message.text.toString())) &&
    ctx.message.text.toString().includes("t.me"),
  async (ctx: MyContext) => {
    ctx.session.wizard = "group.delete";
    ctx.session.step = 2;
    await ctx.reply(`<b>Dein Link: ${ctx.match}</>`, {
      parse_mode: "HTML",
    });
  }
);

composer.on("message:text").filter(
  (ctx) => ctx.session.step == 2,
  async (ctx: MyContext) => {
    ctx.session.wizard = "group.delete";
    ctx.session.step = 2;
    await ctx.reply(`<b>Dein Link ist nicht gültig 2</>`, {
      parse_mode: "HTML",
    });
  }
);

export default composer;
