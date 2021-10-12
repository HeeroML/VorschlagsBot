import connect from "./models";
import bot from "./bot";
import env from "./env";

(async () => {
    await connect(env.MONGO);
    await bot();
})();
