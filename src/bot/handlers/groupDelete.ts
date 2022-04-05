import { Composer } from "grammy";
import isUrlExists from "../../urlexists";
import { getDeleteMarkup, getMainMenu, templatePost } from "../../helpers";
import { MyContext } from "../types/bot";
//@ts-ignore
import meta from "meta-grabber";

const composer = new Composer<MyContext>();

composer.on("message:text").filter(
  async (ctx) =>
    ctx.session.step == 1 && !(await isUrlExists(ctx.message.text.toString())),
  async (ctx: MyContext) => {
    await ctx.reply(
      `<b>Dein Link ist nicht gültig</>
Sende den Link in dem Format: 
<i>https:t.me/</>`,
      {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  }
);

composer.on("message::url").filter(
  async (ctx) =>
    ctx.session.step == 1 && //@ts-ignore
    !ctx.message.text.includes("t.me"),
  async (ctx: MyContext) => {
    await ctx.reply(
      `<b>Dein Link ist keine t.me Url</>
Sende den Link in dem Format: 
<i>https:t.me/</>`,
      {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  }
);

composer.on("message::url").filter(
  async (ctx) =>
    ctx.session.step == 1 && //@ts-ignore
    (await isUrlExists(ctx.message.text.toString())) && //@ts-ignore
    ctx.message.text.toString().includes("t.me"),
  async (ctx: MyContext) => {
    if (ctx.message?.text) {
      ctx.session.wizard = "group.delete";
      ctx.session.step = 2;
      ctx.session.groupLink = ctx.message.text;
      const objectTelegramMeta = meta(ctx.message?.text);
      ctx.session.groupName = objectTelegramMeta["title"];
      ctx.session.groupDescription = objectTelegramMeta["description"];
      await ctx.reply(
        `<b>Dein Link: ${ctx.message?.text}</>
      
Willst du deinen Kanal ${ctx.session.groupName} wirklich löschen?`,
        {
          reply_markup: await getDeleteMarkup(ctx),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    }
  }
);

composer.on("callback_query").filter(
  (ctx) => ctx.session.step == 2,
  async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();
    if (ctx.callbackQuery?.data?.includes("channelDelete.")) {
      ctx
        .reply(await templatePost(ctx), {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        })
        .then(() => {
          ctx.session.wizard = "start";
          ctx.session.step = 0;
          ctx.session.groupLink = "none";
          ctx.session.groupType = "none";
          ctx.session.categoryId = 100;
          ctx.session.groupName = "string";
          ctx.session.groupDescription = "";
        })
        .catch((e) => {
          console.log("Error sending Template Post: " + e);
        });
      await ctx.reply(
        `✅ Gruppe erfolgreich gelöscht.
        
Ich kann deine Gruppen verwalten für @gruppen!`,
        {
          reply_markup: await getMainMenu(),
        }
      );
    } else if (ctx.callbackQuery?.data == "channelAddNo") {
      ctx.session.wizard = "start";
      ctx.session.step = 0;
      ctx.session.groupLink = "none";
      ctx.session.groupType = "none";
      ctx.session.categoryId = 100;
      ctx.session.groupName = "string";
      ctx.session.groupDescription = "";
      await ctx.reply(
        `❌ Gruppe nicht gelöscht.
        
Ich kann deine Gruppen verwalten für @gruppen!`,
        {
          reply_markup: await getMainMenu(),
        }
      );
    }
  }
);

export default composer;
