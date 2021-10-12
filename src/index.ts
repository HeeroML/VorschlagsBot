import connect from "./models";
import bot from "./bot";

(async () => {
    await connect();
    await bot();
})();
