import { Composer } from "grammy";
import { MyContext } from "../types/bot.js";
import { getCategoriesLinkMarkup } from "../../helpers.js";

const composer = new Composer<MyContext>();

composer.command(
  "commands",
  async (ctx: MyContext) =>
    await ctx.reply(
      `<b>Befehle in Privaten Chats</>
/start -  Startet den Bot und die dazugehörigen Informationen
/commands - Diese Liste
/liste - Schickt eine Liste aller Kategorien`,
      { parse_mode: "HTML" }
    )
);

composer.command("liste", async (ctx: MyContext) => {
  const menu = await getCategoriesLinkMarkup();
  await ctx.reply(
    `Gruppenübersicht

@gruppen Kategorien und Kanalliste. 

Stand 04/2022`,
    {
      parse_mode: "HTML",
      reply_markup: menu,
    }
  );
});
export default composer;
