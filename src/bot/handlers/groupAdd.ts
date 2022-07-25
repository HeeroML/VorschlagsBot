import { Composer, InlineKeyboard } from "grammy";
import isUrlExists from "../../urlexists.js";
import {
  getAddConfirmMarkup,
  getCategoriesMarkup,
  getMainMenu,
  nanoid,
  templatePost,
} from "../../helpers.js";
import { groupArray, ListChannel } from "../config/categories.js";
import { MyContext } from "../types/bot.js";
//@ts-ignore
import meta from "meta-grabber";

export const composer = new Composer<MyContext>();

composer.on("message:text").filter(
  async (ctx) =>
    ctx.session.step == 1 && !(await isUrlExists(ctx.message.text.toString())),
  async (ctx) => {
    await ctx.reply(
      `<b>Dein Link ist nicht gültig</>
Sende den Link in dem Format: 
<i>https://t.me/</>`,
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
<i>https://t.me/</>`,
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
  async (ctx) => {
    if (ctx.message?.text) {
      ctx.session.wizard = "group.add";
      ctx.session.step = 2;
      ctx.session.groupLink = ctx.message.text;
      const objectTelegramMeta = meta(ctx.message?.text);
      ctx.session.groupName = objectTelegramMeta["title"];
      ctx.session.groupDescription = objectTelegramMeta["description"];
      await ctx.reply(
        `<b>Dein Link: ${ctx.message?.text}</>
      
Wähle nun ob du eine eigenen Beschreibung eingeben willst!`,
        {
          reply_markup: new InlineKeyboard()
            .text("Eigene Beschreibung", "group.description")
            .text("Keine Beschreibung", "group.no.description"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    } else {
      ctx.session.wizard = "start";
      ctx.session.step = 0;
      ctx.session.groupLink = "none";
      ctx.session.groupType = "none";
      ctx.session.categoryId = 100;
      ctx.session.groupName = "string";
      ctx.session.groupDescription = "";
      await ctx.reply(
        `<b>Dein Link ist bereits in unserer Datenbank!</>

Bitte starte den Prozess neu!`,
        {
          reply_markup: await getMainMenu(),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    }
  }
);

composer.on("callback_query").filter(
  (ctx) => ctx.session.step == 2,
  async (ctx) => {
    ctx.session.wizard = "group.add";
    await ctx.answerCallbackQuery({ text: "Antwort erhalten" });
    await ctx.deleteMessage();
    if (ctx.callbackQuery?.data == "group.description") {
      ctx.session.step = 3;
      await ctx.reply(
        `<b>Sende mir jetzt deine Beschreibung. Schicke dazu einfach eine Textnachricht.</>`,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    } else {
      ctx.session.step = 4;
      await ctx.reply(`Wähle nun ob dein Link eine Gruppe oder Kanal ist!`, {
        reply_markup: new InlineKeyboard()
          .text("Kanal", "group.channel")
          .text("Gruppe", "group.group"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    }
  }
);

composer.on("message:text").filter(
  (ctx) => ctx.session.step == 3,
  async (ctx) => {
    ctx.session.step = 4;
    ctx.session.groupDescription = ctx.message.text;
    await ctx.reply(`Wähle nun ob dein Link eine Gruppe oder Kanal ist!`, {
      reply_markup: new InlineKeyboard()
        .text("Kanal", "group.channel")
        .text("Gruppe", "group.group"),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  }
);

composer.on("callback_query").filter(
  (ctx) => ctx.session.step == 4,
  async (ctx) => {
    ctx.session.wizard = "group.add";
    ctx.session.step = 5;
    await ctx.answerCallbackQuery({ text: "Antwort erhalten" });
    await ctx.deleteMessage();
    const menu = await getCategoriesMarkup();
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
    } else if (ctx.callbackQuery?.data == "group.channel") {
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
  (ctx) => ctx.session.step == 5,
  async (ctx) => {
    ctx.session.wizard = "group.add";
    ctx.session.step = 6;
    ctx.session.groupID = nanoid();
    await ctx.deleteMessage();
    await ctx.answerCallbackQuery({ text: "Antwort erhalten" });
    ctx.session.categoryId = Number(
      ctx.callbackQuery?.data?.replace("channelCat.", "")
    );
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
  (ctx) => ctx.session.step == 6,
  async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();
    if (ctx.callbackQuery?.data?.includes("channelAdd.")) {
      /* createGroup(
        ctx.session.groupID,
        ctx.from.id,
        ctx.session.groupName,
        ctx.session.groupLink,
        ctx.session.groupDescription,
        ctx.session.categoryId,
        ctx.session.groupType
      ); */
      ctx
        .reply(await templatePost(ctx), {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        })
        .then(async () => {
          //const menu = await LikeButton(ctx);
          await ctx.api.sendMessage(
            ListChannel,
            "Neuer Eintrag von: @" +
              ctx.from.username +
              "\nErster Name: " +
              ctx.from.first_name +
              "\nTelegramID: tg://user?id=" +
              ctx.from.id
          );
          await ctx.api.sendMessage(ListChannel, await templatePost(ctx), {
            parse_mode: "HTML",
          });
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
        `✅ Gruppe erfolgreich hinzugefügt! Sie wird nun überprüft!
        
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
        `❌ Gruppe nicht hinzugefügt.
        
Ich kann deine Gruppen verwalten für @gruppen!`,
        {
          reply_markup: await getMainMenu(),
        }
      );
    }
  }
);
export default composer;