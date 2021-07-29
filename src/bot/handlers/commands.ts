import { Composer } from "grammy";
import { MyContext } from "../types/bot";
const composer = new Composer<MyContext>();

composer.command(
  "commands",
  async (ctx: MyContext) =>
    await ctx.reply(
      `<b>Befehle in Privaten Chats</>
/start -  Startet den Bot und die dazugehörigen Informationen
/commands - send this list.

<b>Befehle in Gruppen</>
/gruppe - Schickt den aktuellen Eintrag in @gruppen in deine Gruppe.`,
      { parse_mode: "HTML" }
    )
);

export default composer;
