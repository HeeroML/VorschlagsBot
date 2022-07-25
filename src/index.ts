//import connect from "./models";
import bot from "./bot/index.js";
import env from "./env.js";

(async () => {
  //await connect(env.MONGO);
  await bot();
})();
