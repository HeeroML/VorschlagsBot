import { Composer } from "grammy";
import { MyContext } from "../types/bot";
//@ts-ignore
import meta from "meta-grabber";

const composer = new Composer<MyContext>();
composer.on("my_chat_member:from:me").filter(
  (ctx: MyContext) => ctx.myChatMember?.old_chat_member.status == "left",
  (ctx: MyContext) => {
    console.log(
      "Added to group: " +
        JSON.stringify(ctx.myChatMember) +
        "\n Context: " +
        JSON.stringify(ctx)
    );
  }
);

export default composer;
