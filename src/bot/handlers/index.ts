import { Composer } from "grammy";
import start from "./start.js";
import commands from "./commands.js";
import callback from "./callback.js";
import groupAdd from "./groupAdd.js";
import groupAdd18 from "./groupAdd18.js";
import groupAddBot from "./groupAddBot.js";
import groupDelete from "./groupDelete.js";
import groupUpdate from "./groupUpdate.js";
import { MyContext } from "../types/bot.js";
//import {ListChannel} from "../config/categories";
//import adminCommands from "./adminCommands";

const composer = new Composer<MyContext>();
composer.use(start);
//composer.filter((ctx) => ctx.chat?.id == ListChannel).use(adminCommands);
composer.filter((ctx) => ctx.chat?.type == "private").use(commands);
composer.on("callback_query").use(callback);
composer
  .on("my_chat_member")
  .filter((ctx) => ctx.chat?.type == "private")
  .use(groupAddBot);
composer.filter((ctx) => ctx.session.wizard == "group.add").use(groupAdd);
composer.filter((ctx) => ctx.session.wizard == "group.add18").use(groupAdd18);
composer.filter((ctx) => ctx.session.wizard == "group.delete").use(groupDelete);
composer.filter((ctx) => ctx.session.wizard == "group.update").use(groupUpdate);
composer.filter((ctx) => ctx.chat?.type == "private").use(commands);

export default composer;
