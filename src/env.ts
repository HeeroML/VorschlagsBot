import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export default cleanEnv(process.env, {
  TOKEN: str(),
  CACHE: num(),
  MONGO: str(),
  DOMAIN: str(),
});
