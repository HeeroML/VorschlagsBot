import { Composer, InlineKeyboard } from "grammy";
import isUrlExists from "url-exists-nodejs";
import {
  getAddConfirmMarkup,
  getCategoriesMarkup,
  getMainMenu,
  nanoid,
  templatePost,
} from "../../helpers";
import { groupArray } from "../config/categories";
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
      ctx.session.wizard = "group.add";
      ctx.session.step = 2;
      ctx.session.groupLink = ctx.message.text;
      const objectTelegramMeta = meta(ctx.message?.text);
      ctx.session.groupName = objectTelegramMeta["title"];
      ctx.session.groupDescription = objectTelegramMeta["description"];
      await ctx.reply(
        `<b>Dein Link: ${ctx.message?.text}</>
      
Wähle nun ob dein Link eine Gruppe oder Kanal ist!`,
        {
          reply_markup: new InlineKeyboard()
            .text("Kanal", "group.channel")
            .text("Gruppe", "group.group"),
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
    ctx.session.wizard = "group.add";
    ctx.session.step = 3;
    await ctx.answerCallbackQuery({ text: "Antwort erhalten" });
    await ctx.deleteMessage();
    const menu = await getCategoriesMarkup();
    console.log(menu);
    if (ctx.callbackQuery?.data == "group.group") {
      ctx.session.groupType = "Group";
      await ctx.reply(
        `<b>In welcher Kategorie würdest du deine Gruppe einordnen?</>`,
        {
          reply_markup: menu,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    } else {
      ctx.session.groupType = "Channel";
      await ctx.reply(
        `<b>In welcher Kategorie würdest du deinen Kanal einordnen?</>`,
        {
          reply_markup: menu,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    }
  }
);

composer.on("callback_query").filter(
  (ctx) => ctx.session.step == 3,
  async (ctx: MyContext) => {
    ctx.session.wizard = "group.add";
    ctx.session.step = 4;
    ctx.session.groupID = nanoid();
    await ctx.deleteMessage();
    await ctx.answerCallbackQuery({ text: "Antwort erhalten" });
    const categoryID = Number(
      ctx.callbackQuery?.data?.replace("channelCat.", "")
    );
    ctx.session.categoryId = categoryID;
    const menu = await getAddConfirmMarkup(ctx);
    let textGroup: string;
    let textGroup2: string;
    if (ctx.session.groupType == "Group") {
      textGroup = "Deine Gruppe:";
      textGroup2 = "die Gruppe";
    } else {
      textGroup = "Dein Kanal:";
      textGroup2 = "den Kanal";
    }
    await ctx.reply(
      `<i>${textGroup}</> <b>${ctx.session.groupName}</>
      
<i>Beschreibung:</>  
${ctx.session.groupDescription}

<i>Kategorie:</> ${groupArray[0][ctx.session.categoryId]}
  
<b>Wilst du ${textGroup2} hinzufügen?</>`,
      {
        reply_markup: menu,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  }
);

composer.on("callback_query").filter(
  (ctx) => ctx.session.step == 4,
  async (ctx: MyContext) => {
    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();
    if (ctx.callbackQuery?.data?.includes("channelAdd.")) {
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
        `✅ Gruppe erfolgreich hinzugefügt. Sie wird nun überprüft!
        
Ich kann deine Gruppen verwalten für @gruppen!`,
        {
          reply_markup: await getMainMenu(ctx),
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
        `❌ Gruppe nicht hinzugefügt.
        
Ich kann deine Gruppen verwalten für @gruppen!`,
        {
          reply_markup: await getMainMenu(ctx),
        }
      );
    }
  }
);

export default composer;
