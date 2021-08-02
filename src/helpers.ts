import { InlineKeyboard } from "grammy";
import { groupArray } from "./bot/config/categories";
import { MyContext } from "./bot/types/bot";
import { customAlphabet } from "nanoid";
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const nanoid = customAlphabet(alphabet, 10);

export const getAddConfirmMarkup = async (
  ctx: MyContext
): Promise<InlineKeyboard> => {
  return new InlineKeyboard()
    .text("Ja", "channelAdd." + ctx.session.categoryId)
    .text("Nein", "channelAddNo");
};

export const getCategoriesMarkup = async (): Promise<InlineKeyboard> => {
  return new InlineKeyboard()
    .text(groupArray[0][0], "channelCat.0")
    .row()
    .text(groupArray[0][1], "channelCat.1")
    .row()
    .text(groupArray[0][2], "channelCat.2")
    .row()
    .text(groupArray[0][3], "channelCat.3")
    .row()
    .text(groupArray[0][4], "channelCat.4")
    .row()
    .text(groupArray[0][5], "channelCat.5")
    .row()
    .text(groupArray[0][6], "channelCat.6")
    .row()
    .text(groupArray[0][7], "channelCat.7")
    .row()
    .text(groupArray[0][8], "channelCat.8")
    .row()
    .text(groupArray[0][9], "channelCat.9")
    .text(groupArray[0][10], "channelCat.10");
};
export const getCategoriesLinkMarkup = async (): Promise<InlineKeyboard> => {
  return new InlineKeyboard()
    .url(groupArray[0][11], groupArray[1][11])
    .row()
    .url(groupArray[0][0], groupArray[1][0])
    .row()
    .url(groupArray[0][1], groupArray[1][1])
    .row()
    .url(groupArray[0][2], groupArray[1][2])
    .row()
    .url(groupArray[0][3], groupArray[1][3])
    .row()
    .url(groupArray[0][4], groupArray[1][4])
    .row()
    .url(groupArray[0][5], groupArray[1][5])
    .row()
    .url(groupArray[0][6], groupArray[1][6])
    .row()
    .url(groupArray[0][7], groupArray[1][7])
    .row()
    .url(groupArray[0][8], groupArray[1][8])
    .row()
    .url(groupArray[0][9], groupArray[1][9])
    .url(groupArray[0][10], groupArray[1][10]);
};

export async function templatePost(ctx: MyContext) {
  let textType: string;
  if (ctx.session.groupType == "Channel") {
    textType = "Kanal: ";
  } else {
    textType = "Gruppe: ";
  }
  const text = `<b>${ctx.session.groupName}</>
Beschreibung: ${ctx.session.groupDescription}

${textType} ${ctx.session.groupLink}

ID: <code>${ctx.session.groupID}</code> 
<i>(Klicken zum Kopieren)</>


🌷➖➖➖➖➖➖
Unsere Übersicht: @gruppen
Kategorie: <a href="${groupArray[1][ctx.session.categoryId]}">${
    groupArray[0][ctx.session.categoryId]
  }</a>
➖➖➖➖➖➖🌷`;

  return text;
}
