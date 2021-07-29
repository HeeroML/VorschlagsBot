import { Composer } from "grammy";
import start from "./start";
import commands from "./commands";
import callback from "./callback";
import groupAdd from "./groupAdd";
import groupDelete from "./groupDelete";
import groupUpdate from "./groupUpdate";
import { MyContext } from "../types/bot";
const composer = new Composer<MyContext>();
composer.use(commands);
composer
  .filter((ctx: MyContext) => ctx.session.wizard == "group.add")
  .use(groupAdd);
composer
  .filter((ctx: MyContext) => ctx.session.wizard == "group.delete")
  .use(groupDelete);
composer
  .filter((ctx: MyContext) => ctx.session.wizard == "group.update")
  .use(groupUpdate);
composer.filter((ctx: MyContext) => ctx.chat?.type == "private").use(commands);
composer.on("callback_query").use(callback);

composer.use(start);

export default composer;
